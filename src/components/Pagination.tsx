/** Page numbers with ellipses once there are more than 7 pages: 1 2 3 … 8 */
function pageList(page: number, n: number): (number | '…')[] {
  if (n <= 7) return Array.from({ length: n }, (_, i) => i + 1);
  const set = new Set([1, 2, n, page - 1, page, page + 1].filter((x) => x >= 1 && x <= n));
  if (page <= 3) set.add(3);
  const sorted = [...set].sort((a, b) => a - b);
  const out: (number | '…')[] = [];
  sorted.forEach((x, i) => {
    if (i && x - sorted[i - 1] > 1) out.push('…');
    out.push(x);
  });
  return out;
}

export function Pagination({ page, nPages, setPage }: { page: number; nPages: number; setPage: (n: number) => void }) {
  return (
    <nav className="pagination" aria-label="Pagination">
      <button className="pill-outline" onClick={() => setPage(page - 1)} disabled={page <= 1}>‹ Previous</button>
      <div className="pagination__pages">
        {pageList(page, nPages).map((x, i) =>
          x === '…' ? (
            <span key={'e' + i} className="pagination__gap">…</span>
          ) : (
            <button
              key={x}
              className={'pagination__num' + (x === page ? ' is-current' : '')}
              aria-current={x === page ? 'page' : undefined}
              onClick={() => setPage(x)}
            >
              {x}
            </button>
          ),
        )}
      </div>
      <button className="pill-outline" onClick={() => setPage(page + 1)} disabled={page >= nPages}>Next ›</button>
    </nav>
  );
}
