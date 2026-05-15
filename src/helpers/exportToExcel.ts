import * as XLSX from 'xlsx-js-style';

import { OrderType } from '@/src/types/types';

type ExcelCell = {
  v: string | number;
  s: XLSX.CellStyle;
};

function createOrderRow(
  order: OrderType | undefined,
  r: number,
  maxItems: number,
  baseStyle: XLSX.CellStyle,
  headerStyle: XLSX.CellStyle,
  clientStyle: XLSX.CellStyle,
) {
  const empty = (): ExcelCell => ({ v: '', s: baseStyle });

  if (!order) return [empty(), empty(), empty()];

  if (r === 0)
    return [
      { v: order.profile_name?.toUpperCase() ?? '—', s: clientStyle },
      empty(),
      empty(),
    ];

  if (r === 1)
    return [
      { v: 'Uds', s: headerStyle },
      { v: 'Articulo', s: headerStyle },
      { v: '', s: headerStyle },
    ];

  const item = order.items[r - 2];
  if (!item) return [empty(), empty(), empty()];

  const units = item.quantity * item.units_per_box;

  return [
    {
      v: units,
      s: { ...baseStyle, alignment: { horizontal: 'center' as const } },
    },
    { v: item.title, s: baseStyle },
    empty(),
  ];
}

function applyOrderBorders(
  ws: XLSX.WorkSheet,
  orders: OrderType[],
  ordersPerRow: number,
  blockWidth: number,
) {
  const thick = { style: 'medium' as const, color: { rgb: '000000' } };

  let rowPointer = 0;

  for (let i = 0; i < orders.length; i += ordersPerRow) {
    const group = orders.slice(i, i + ordersPerRow);
    const maxItems = Math.max(...group.map((o) => o.items.length));

    const startRow = rowPointer;
    const endRow = rowPointer + maxItems + 1;

    group.forEach((_, g) => {
      const startCol = g * blockWidth;
      const endCol = startCol + 2;

      for (let r = startRow; r <= endRow; r++) {
        for (let c = startCol; c <= endCol; c++) {
          const ref = XLSX.utils.encode_cell({ r, c });
          const cell = ws[ref];

          if (!cell?.s?.border) continue;

          const border = { ...cell.s.border };

          if (r === startRow) border.top = thick;
          if (r === endRow) border.bottom = thick;
          if (c === startCol) border.left = thick;
          if (c === endCol) border.right = thick;

          cell.s = {
            ...cell.s,
            border,
          };
        }
      }
    });

    rowPointer += maxItems + 2;
  }
}

export function exportOrdersToExcel(orders: OrderType[]) {
  const ordersPerRow = 3;
  const blockWidth = 3;

  const thinBorder = {
    top: { style: 'thin' as const, color: { rgb: '000000' } },
    bottom: { style: 'thin' as const, color: { rgb: '000000' } },
    left: { style: 'thin' as const, color: { rgb: '000000' } },
    right: { style: 'thin' as const, color: { rgb: '000000' } },
  };

  const baseStyle: XLSX.CellStyle = {
    font: { sz: 12 },
    border: { ...thinBorder },
  };

  const headerStyle: XLSX.CellStyle = {
    font: { bold: true, sz: 12 },
    alignment: { horizontal: 'center' as const },
    border: thinBorder,
  };

  const clientStyle: XLSX.CellStyle = {
    font: { bold: true, underline: true, sz: 12 },
    alignment: { horizontal: 'left' },
    border: thinBorder,
  };

  const rows: ExcelCell[][] = [];
  const merges: XLSX.Range[] = [];

  let currentRow = 0;

  for (let i = 0; i < orders.length; i += ordersPerRow) {
    const group = orders.slice(i, i + ordersPerRow);
    const maxItems = Math.max(...group.map((o) => o.items.length));
    const groupHeight = maxItems + 2;

    for (let r = 0; r < groupHeight; r++) {
      const row: ExcelCell[] = [];

      group.forEach((order, g) => {
        const block = createOrderRow(
          order,
          r,
          maxItems,
          baseStyle,
          headerStyle,
          clientStyle,
        );

        row.push(...block);

        if (r === 0) {
          merges.push({
            s: { r: currentRow, c: g * blockWidth },
            e: { r: currentRow, c: g * blockWidth + 2 },
          });
        }
      });

      rows.push(row);
      currentRow++;
    }
  }

  const ws = XLSX.utils.aoa_to_sheet(rows);

  ws['!cols'] = [
    { wch: 5 },
    { wch: 35 },
    { wch: 5 },
    { wch: 5 },
    { wch: 35 },
    { wch: 5 },
    { wch: 5 },
    { wch: 35 },
    { wch: 5 },
  ];

  ws['!merges'] = merges;

  applyOrderBorders(ws, orders, ordersPerRow, blockWidth);

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Pedidos');

  const date = new Date().toISOString().split('T')[0];
  XLSX.writeFile(wb, `pedidos_${date}.xlsx`);
}
