"use client";

/**
 * Skeleton giữ ĐÚNG khung của tin hóa đơn và dòng thành viên nên không nhảy
 * layout khi Firestore trả dữ liệu. Không spinner giữa màn.
 */
const block = "bg-wall-2 rounded-[6px]";

export default function ThreadSkeleton() {
  return (
    <div aria-hidden className="animate-pulse mx-auto w-full max-w-[720px] px-3 sm:px-4 pt-4 space-y-3">
      <div className="flex justify-center pt-2">
        <div className={`${block} h-6 w-28 rounded-full`} />
      </div>
      {[0, 1, 2].map((i) => (
        <div key={i} className="flex items-end gap-2">
          <div className={`${block} w-8 h-8 rounded-full`} />
          <div className="w-full max-w-[min(88%,520px)] bubble-in bg-bubble px-3.5 pt-3 pb-2.5">
            <div className="grid grid-cols-[36px_minmax(0,1fr)_72px] gap-3 items-start">
              <div className={`${block} w-9 h-9`} />
              <div>
                <div className={`${block} h-4 w-[60%]`} />
                <div className={`${block} h-3 w-[45%] mt-2`} />
              </div>
              <div className={`${block} h-4`} />
            </div>
            <div className="mt-3 pt-2.5 border-t border-line flex gap-1">
              {[0, 1, 2, 3].map((j) => (
                <div key={j} className={`${block} w-7 h-7 rounded-full`} />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function MembersSkeleton() {
  return (
    <div aria-hidden className="animate-pulse px-4 sm:px-5 pt-5 space-y-3">
      <div className={`${block} h-6 w-32`} />
      <div className={`${block} h-4 w-[70%]`} />
      <div className={`${block} h-2 w-full rounded-full`} />
      {[0, 1, 2, 3, 4].map((i) => (
        <div key={i} className="grid grid-cols-[40px_minmax(0,1fr)_80px] items-center gap-3 py-3 border-b border-line">
          <div className={`${block} w-10 h-10 rounded-full`} />
          <div>
            <div className={`${block} h-4 w-[50%]`} />
            <div className={`${block} h-3 w-[70%] mt-2`} />
          </div>
          <div className={`${block} h-4`} />
        </div>
      ))}
    </div>
  );
}
