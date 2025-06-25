import React from "react";
import Link from "next/link";

export interface EntityTableColumn<T> {
  key: keyof T | string;
  label: string;
  render?: (row: T) => React.ReactNode;
}

interface EntityTableProps<T> {
  data: T[];
  loading: boolean;
  columns: EntityTableColumn<T>[];
  role: { role: number };
  selectedRow: T | null;
  setSelectedRow: (row: T | null) => void;
  handleDelete: (id: number) => void;
  editHref: (row: T) => string;
  entityLabel: string;
}

export default function EntityTable<T extends { id: number; name: string }>({
  data,
  loading,
  columns,
  role,
  selectedRow,
  setSelectedRow,
  handleDelete,
  editHref,
  entityLabel,
}: EntityTableProps<T>) {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key as string}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {col.label}
              </th>
            ))}
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {loading ? (
            <tr>
              <td
                colSpan={columns.length + 1}
                className="text-center py-8 text-gray-500"
              >
                Loading...
              </td>
            </tr>
          ) : !data || data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + 1}
                className="text-center py-8 text-red-500"
              >
                Error fetching {entityLabel}
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr key={row.id} className="hover:bg-blue-50 transition-all">
                {columns.map((col) => (
                  <td
                    key={col.key as string}
                    className="px-6 py-4 whitespace-nowrap text-gray-700"
                  >
                    {col.render
                      ? col.render(row)
                      : String(row[col.key as keyof T])}
                  </td>
                ))}
                <td className="px-6 py-4 whitespace-nowrap space-x-2">
                  <button
                    onClick={() => setSelectedRow(row)}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded-lg font-medium shadow-sm transition-all"
                  >
                    View
                  </button>
                  {selectedRow && selectedRow.id === row.id && (
                    <EntityViewDetails
                      row={selectedRow}
                      close={() => setSelectedRow(null)}
                    />
                  )}
                  {Number(role.role) === 1 && (
                    <>
                      <Link
                        href={editHref(row)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-1 rounded-lg font-medium shadow-sm transition-all"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(row.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-lg font-medium shadow-sm transition-all"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

function EntityViewDetails<T extends { name: string }>({
  row,
  close,
}: {
  row: T;
  close: () => void;
}) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-gray-200">
        <div className="flex items-center justify-between px-8 py-5 bg-gradient-to-r from-blue-700 to-blue-500 rounded-t-2xl">
          <div className="text-2xl font-bold text-white tracking-wide flex items-center gap-2">
            <svg
              className="w-7 h-7 text-blue-200"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="7" r="4" />
              <path d="M5.5 21a7.5 7.5 0 0 1 13 0" />
            </svg>
            {row.name}
          </div>
          <button
            onClick={close}
            className="text-white hover:text-blue-200 text-2xl font-bold px-2"
            aria-label="Close"
            title="Close"
          >
            ×
          </button>
        </div>
        <div className="border-b border-gray-100" />
        <div className="px-8 py-8 flex flex-col gap-6 bg-gray-50 rounded-b-2xl">
          {Object.entries(row).map(([key, value]) =>
            key !== "id" && key !== "name" && value !== undefined ? (
              <div className="flex items-center gap-3" key={key}>
                <span className="w-28 text-xs text-gray-500 font-semibold">
                  {key
                    .replace(/_/g, " ")
                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                </span>
                <span className="text-base text-gray-800 font-medium">
                  {String(value)}
                </span>
              </div>
            ) : null
          )}
        </div>
      </div>
    </div>
  );
}
