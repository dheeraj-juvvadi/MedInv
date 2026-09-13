import { NextRequest, NextResponse } from "next/server";
import { executeRawQuery } from "@/lib/mysql";

// Define interfaces for expected data structures
interface ColumnInfo {
  name: string;
  type: string;
  nullable: boolean;
  defaultValue: string | null;
  isPrimaryKey: boolean;
  isForeignKey: boolean; // Initial value, will be updated
  referencesTable?: string | null;
  referencesColumn?: string | null;
}

interface ForeignKeyInfo {
  column_name: string;
  referenced_table: string;
  referenced_column: string;
}

interface TableStats {
  rowCount: number;
  createdAt: string | Date;
  lastUpdated: string | Date;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ tableName: string }> },
) {
  const { tableName } = await params;

  try {
    // Fetch table structure (columns and their details)
    const columnsQuery = `
      SELECT 
        COLUMN_NAME as name,
        COLUMN_TYPE as type,
        IS_NULLABLE = 'YES' as nullable,
        COLUMN_DEFAULT as defaultValue,
        COLUMN_KEY = 'PRI' as isPrimaryKey,
        false as isForeignKey
      FROM 
        INFORMATION_SCHEMA.COLUMNS 
      WHERE 
        TABLE_SCHEMA = 'test2'
        AND TABLE_NAME = ?
      ORDER BY 
        ORDINAL_POSITION
    `;

    // Cast the result to the defined interface array
    const columns = (await executeRawQuery(columnsQuery, [
      tableName,
    ])) as ColumnInfo[];

    // Fetch foreign keys information
    const foreignKeysQuery = `
      SELECT
        k.COLUMN_NAME as column_name,
        k.REFERENCED_TABLE_NAME as referenced_table,
        k.REFERENCED_COLUMN_NAME as referenced_column
      FROM
        INFORMATION_SCHEMA.KEY_COLUMN_USAGE k
      WHERE
        k.TABLE_SCHEMA = 'test2'
        AND k.TABLE_NAME = ?
        AND k.REFERENCED_TABLE_NAME IS NOT NULL
    `;

    // Cast the result to the defined interface array
    const foreignKeys = (await executeRawQuery(foreignKeysQuery, [
      tableName,
    ])) as ForeignKeyInfo[];

    // FIX 1: Improved foreign key mapping with case insensitive comparison and null checks
    // Use the defined types in the map and find callbacks
    const columnsWithForeignKeys = columns.map((column: ColumnInfo) => {
      // Only compare if both values exist and use case-insensitive comparison
      const foreignKey = foreignKeys.find(
        (fk: ForeignKeyInfo) =>
          fk?.column_name &&
          column?.name &&
          String(fk.column_name).toLowerCase() ===
            String(column.name).toLowerCase(),
      );

      if (foreignKey) {
        return {
          ...column,
          isForeignKey: true,
          // Add null/undefined checks for referenced values
          referencesTable: foreignKey.referenced_table ?? null,
          referencesColumn: foreignKey.referenced_column ?? null,
        };
      }
      return column;
    });

    // Fetch tables that reference this table (reverse relations)
    const referencedByQuery = `
      SELECT
        k.TABLE_NAME as table_name,
        k.COLUMN_NAME as column_name,
        k.REFERENCED_COLUMN_NAME as referenced_column
      FROM
        INFORMATION_SCHEMA.KEY_COLUMN_USAGE k
      WHERE
        k.TABLE_SCHEMA = 'test2'
        AND k.REFERENCED_TABLE_NAME = ?
    `;

    const referencedBy = await executeRawQuery(referencedByQuery, [tableName]);

    // Get last update information (can be approximated from table stats or other metadata)
    const statsQuery = `
      SELECT 
        TABLE_ROWS as rowCount,
        CREATE_TIME as createdAt,
        UPDATE_TIME as lastUpdated
      FROM 
        INFORMATION_SCHEMA.TABLES 
      WHERE 
        TABLE_SCHEMA = 'test2' 
        AND TABLE_NAME = ?
    `;

    // Cast the result to the defined interface array
    const stats = (await executeRawQuery(statsQuery, [
      tableName,
    ])) as TableStats[];

    // FIX 2: Better stats handling with proper null checks and defaults
    // Check if stats exists and has at least one element
    const defaultDate = new Date().toISOString();
    // Use the defined type
    const tableStats: TableStats | null =
      Array.isArray(stats) && stats.length > 0 ? stats[0] : null;

    // Combine all information with better null handling
    const tableDetails = {
      name: tableName,
      columns: columnsWithForeignKeys || [],
      referencedBy: referencedBy || [],
      // Use nullish coalescing for safer defaults
      rowCount: tableStats?.rowCount ?? 0,
      createdAt:
        tableStats && tableStats.createdAt
          ? new Date(tableStats.createdAt).toISOString().split("T")[0]
          : defaultDate.split("T")[0],
      lastUpdated:
        tableStats && tableStats.lastUpdated
          ? new Date(tableStats.lastUpdated).toISOString().split("T")[0]
          : defaultDate.split("T")[0],
    };

    return NextResponse.json(tableDetails, { status: 200 });
  } catch (error) {
    console.error(`Error fetching details for table ${tableName}:`, error);
    return NextResponse.json(
      { error: `Failed to fetch details for table ${tableName}` },
      { status: 500 },
    );
  }
}
