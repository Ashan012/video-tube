"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

export default function Sidebar({ items, sidebar, setSidebar }) {
  const router = useRouter();
  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-60 border-r px-3 py-4 flex-col justify-between">
        <div className="flex flex-col gap-2 text-sm">
          {items.map((item) => (
            <div
              key={item}
              onClick={() => router.push(`/feed/${item}`)}
              className="px-3 py-2 rounded hover:bg-gray-100 cursor-pointer capitalize"
            >
              {item.replace("-", " ")}
            </div>
          ))}
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebar && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 left-0 h-full w-64 bg-white z-50 shadow-lg border-r"
          >
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-bold">Menu</h2>
              <button
                onClick={() => setSidebar(false)}
                className="text-gray-500 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col p-4 gap-2 text-sm">
              {items.map((item) => (
                <div
                  key={item}
                  className="px-3 py-2 rounded hover:bg-gray-100 cursor-pointer capitalize"
                  onClick={() => setSidebar(false)}
                >
                  {item.replace("-", " ")}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay */}
      {sidebar && (
        <div
          onClick={() => setSidebar(false)}
          className="fixed inset-0  bg-opacity-30 z-40"
        ></div>
      )}
    </>
  );
}
