'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface HeaderProps {
  isProcessOn: boolean;
  isDataDelayed: boolean;
}

export function Header({ isProcessOn, isDataDelayed }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo + Title */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center overflow-hidden flex-shrink-0">
              <span className="text-lg">🦫</span>
            </div>
            <span className="text-xl font-semibold text-gray-900">
              Beaver Project - 2304
            </span>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-3">
            {/* Data Delayed badge */}
            <AnimatePresence>
              {isDataDelayed && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-medium"
                >
                  Data Delayed
                </motion.div>
              )}
            </AnimatePresence>

            {/* Process status pill */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600 font-medium">Process</span>
              <div
                className={`flex items-center space-x-1.5 text-sm px-3 py-1.5 rounded-full font-semibold transition-colors duration-300 ${
                  isProcessOn
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    isProcessOn
                      ? 'bg-green-500 animate-pulse'
                      : 'bg-gray-400'
                  }`}
                />
                <span>{isProcessOn ? 'ON' : 'OFF'}</span>
              </div>
            </div>

            {/* Beaver logo avatar */}
            <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center overflow-hidden flex-shrink-0">
              <span className="text-base">🌊</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
