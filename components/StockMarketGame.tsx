"use client";

import { useState, useEffect } from "react";

type Stock = {
  id: string;
  name: string;
  currentPrice: number;
  priceHistory: number[];
  changePercent: number;
};

type Portfolio = {
  cash: number;
  shares: Record<string, number>;
  averagePurchasePrice: Record<string, number>; // Track average purchase price per stock
};

const INITIAL_STOCKS: Omit<Stock, "changePercent">[] = [
  { id: "techcorp", name: "TechCorp", currentPrice: 500, priceHistory: [500] },
  { id: "financeplus", name: "FinancePlus", currentPrice: 750, priceHistory: [750] },
  { id: "greenenergy", name: "GreenEnergy", currentPrice: 300, priceHistory: [300] },
  { id: "medilife", name: "MediLife", currentPrice: 1200, priceHistory: [1200] },
  { id: "retailmart", name: "RetailMart", currentPrice: 450, priceHistory: [450] },
  { id: "cloudsoft", name: "CloudSoft", currentPrice: 850, priceHistory: [850] },
  { id: "autodrive", name: "AutoDrive", currentPrice: 600, priceHistory: [600] },
  { id: "foodchain", name: "FoodChain", currentPrice: 350, priceHistory: [350] },
  { id: "buildpro", name: "BuildPro", currentPrice: 400, priceHistory: [400] },
  { id: "telecomnet", name: "TelecomNet", currentPrice: 550, priceHistory: [550] },
  { id: "eduverse", name: "EduVerse", currentPrice: 250, priceHistory: [250] },
  { id: "entertainhub", name: "EntertainHub", currentPrice: 700, priceHistory: [700] },
];

const INITIAL_CASH = 100000; // 1 lakh

export default function StockMarketGame() {
  const [stocks, setStocks] = useState<Stock[]>(() =>
    INITIAL_STOCKS.map((stock) => ({
      ...stock,
      changePercent: 0,
    }))
  );
  const [portfolio, setPortfolio] = useState<Portfolio>(() => {
    const saved = localStorage.getItem("stock-market-portfolio");
    if (saved) {
      const parsed = JSON.parse(saved);
      // Ensure averagePurchasePrice exists for backward compatibility
      return {
        ...parsed,
        averagePurchasePrice: parsed.averagePurchasePrice || {},
      };
    }
    return {
      cash: INITIAL_CASH,
      shares: {},
      averagePurchasePrice: {},
    };
  });
  const [day, setDay] = useState(() => {
    const saved = localStorage.getItem("stock-market-day");
    return saved ? parseInt(saved, 10) : 1;
  });
  const [quantities, setQuantities] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Save game state to localStorage
  useEffect(() => {
    localStorage.setItem("stock-market-portfolio", JSON.stringify(portfolio));
    localStorage.setItem("stock-market-day", day.toString());
  }, [portfolio, day]);

  // Update stock prices each day
  const advanceDay = () => {
    setStocks((prevStocks) =>
      prevStocks.map((stock) => {
        // Random price change between -5% and +5%
        const changePercent = (Math.random() * 10 - 5) / 100;
        const newPrice = Math.max(100, stock.currentPrice * (1 + changePercent));
        const roundedPrice = Math.round(newPrice);
        
        return {
          ...stock,
          currentPrice: roundedPrice,
          priceHistory: [...stock.priceHistory, roundedPrice],
          changePercent: changePercent * 100,
        };
      })
    );
    setDay((prev) => prev + 1);
    setMessage({ text: "Day advanced! Stock prices updated.", type: "success" });
    setTimeout(() => setMessage(null), 3000);
  };

  // Calculate portfolio value
  const portfolioValue = stocks.reduce((total, stock) => {
    const shares = portfolio.shares[stock.id] || 0;
    return total + shares * stock.currentPrice;
  }, 0);

  const totalValue = portfolio.cash + portfolioValue;

  // Buy stock
  const buyStock = (stockId: string) => {
    const quantity = parseInt(quantities[stockId] || "0", 10);
    if (quantity <= 0) {
      setMessage({ text: "Please enter a valid quantity", type: "error" });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    const stock = stocks.find((s) => s.id === stockId);
    if (!stock) return;

    const cost = quantity * stock.currentPrice;
    if (cost > portfolio.cash) {
      setMessage({ text: "Insufficient cash!", type: "error" });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    setPortfolio((prev) => {
      const existingShares = prev.shares[stockId] || 0;
      const existingAvgPrice = prev.averagePurchasePrice[stockId] || 0;
      const newTotalShares = existingShares + quantity;
      
      // Calculate weighted average purchase price
      let newAvgPrice = stock.currentPrice;
      if (existingShares > 0) {
        const existingValue = existingShares * existingAvgPrice;
        const newValue = quantity * stock.currentPrice;
        newAvgPrice = (existingValue + newValue) / newTotalShares;
      }

      return {
        cash: prev.cash - cost,
        shares: {
          ...prev.shares,
          [stockId]: newTotalShares,
        },
        averagePurchasePrice: {
          ...prev.averagePurchasePrice,
          [stockId]: newAvgPrice,
        },
      };
    });

    setQuantities((prev) => ({ ...prev, [stockId]: "" }));
    setMessage({ text: `Bought ${quantity} shares of ${stock.name}`, type: "success" });
    setTimeout(() => setMessage(null), 3000);
    advanceDay();
  };

  // Sell stock
  const sellStock = (stockId: string) => {
    const quantity = parseInt(quantities[stockId] || "0", 10);
    if (quantity <= 0) {
      setMessage({ text: "Please enter a valid quantity", type: "error" });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    const ownedShares = portfolio.shares[stockId] || 0;
    if (quantity > ownedShares) {
      setMessage({ text: "You don't own enough shares!", type: "error" });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    const stock = stocks.find((s) => s.id === stockId);
    if (!stock) return;

    const revenue = quantity * stock.currentPrice;

    setPortfolio((prev) => {
      const newShares = (prev.shares[stockId] || 0) - quantity;
      // Keep average purchase price the same (we're using average cost basis)
      const newAvgPrice = newShares === 0 ? 0 : prev.averagePurchasePrice[stockId] || 0;

      return {
        cash: prev.cash + revenue,
        shares: {
          ...prev.shares,
          [stockId]: newShares,
        },
        averagePurchasePrice: {
          ...prev.averagePurchasePrice,
          [stockId]: newAvgPrice,
        },
      };
    });

    setQuantities((prev) => ({ ...prev, [stockId]: "" }));
    setMessage({ text: `Sold ${quantity} shares of ${stock.name}`, type: "success" });
    setTimeout(() => setMessage(null), 3000);
    advanceDay();
  };

  // Reset game
  const resetGame = () => {
    if (confirm("Are you sure you want to reset? This will clear all progress.")) {
      setPortfolio({
        cash: INITIAL_CASH,
        shares: {},
        averagePurchasePrice: {},
      });
      setDay(1);
      setStocks(
        INITIAL_STOCKS.map((stock) => ({
          ...stock,
          changePercent: 0,
        }))
      );
      setQuantities({});
      localStorage.removeItem("stock-market-portfolio");
      localStorage.removeItem("stock-market-day");
      setMessage({ text: "Game reset!", type: "success" });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-black/40 backdrop-blur border border-white/10 rounded-xl p-6">
        <h1 className="text-3xl font-bold mb-2">Stock Market Simulator</h1>
        <p className="text-gray-400">Practice trading with virtual money!</p>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-black/40 backdrop-blur border border-white/10 rounded-xl p-4">
          <p className="text-sm text-gray-400 mb-1">Cash Balance</p>
          <p className="text-2xl font-bold text-green-400">
            ₹{portfolio.cash.toLocaleString()}
          </p>
        </div>
        <div className="bg-black/40 backdrop-blur border border-white/10 rounded-xl p-4">
          <p className="text-sm text-gray-400 mb-1">Portfolio Value</p>
          <p className="text-2xl font-bold text-blue-400">
            ₹{portfolioValue.toLocaleString()}
          </p>
        </div>
        <div className="bg-black/40 backdrop-blur border border-white/10 rounded-xl p-4">
          <p className="text-sm text-gray-400 mb-1">Total Value</p>
          <p className="text-2xl font-bold text-yellow-400">
            ₹{totalValue.toLocaleString()}
          </p>
        </div>
        <div className="bg-black/40 backdrop-blur border border-white/10 rounded-xl p-4">
          <p className="text-sm text-gray-400 mb-1">Day</p>
          <p className="text-2xl font-bold text-purple-400">{day}</p>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div
          className={`p-4 rounded-xl border ${
            message.type === "success"
              ? "bg-green-500/20 border-green-500/50 text-green-400"
              : "bg-red-500/20 border-red-500/50 text-red-400"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Portfolio Section */}
      {Object.keys(portfolio.shares).some((id) => (portfolio.shares[id] || 0) > 0) && (
        <div className="bg-black/40 backdrop-blur border border-white/10 rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4">Your Portfolio</h2>
          <div className="space-y-3">
            {stocks
              .filter((stock) => (portfolio.shares[stock.id] || 0) > 0)
              .map((stock) => {
                const shares = portfolio.shares[stock.id] || 0;
                const avgPurchasePrice = portfolio.averagePurchasePrice[stock.id] || 0;
                const currentValue = shares * stock.currentPrice;
                const investedValue = shares * avgPurchasePrice;
                const profitLoss = currentValue - investedValue;
                const profitLossPercent = avgPurchasePrice > 0 
                  ? ((stock.currentPrice - avgPurchasePrice) / avgPurchasePrice) * 100 
                  : 0;
                const isProfit = profitLoss >= 0;

                return (
                  <div
                    key={stock.id}
                    className="bg-black/20 border border-white/5 rounded-lg p-4 hover:bg-black/30 transition"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold">{stock.name}</h3>
                          <span
                            className={`text-sm font-semibold px-2 py-1 rounded ${
                              isProfit
                                ? "bg-green-500/20 text-green-400"
                                : "bg-red-500/20 text-red-400"
                            }`}
                          >
                            {isProfit ? "+" : ""}₹{Math.abs(profitLoss).toLocaleString()} ({isProfit ? "+" : ""}{profitLossPercent.toFixed(2)}%)
                          </span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                          <div>
                            <span className="text-gray-400">Shares:</span>
                            <span className="ml-2 font-bold text-white">{shares}</span>
                          </div>
                          <div>
                            <span className="text-gray-400">Avg Price:</span>
                            <span className="ml-2 font-bold text-white">₹{Math.round(avgPurchasePrice)}</span>
                          </div>
                          <div>
                            <span className="text-gray-400">Current Price:</span>
                            <span className="ml-2 font-bold text-white">₹{stock.currentPrice}</span>
                          </div>
                          <div>
                            <span className="text-gray-400">Value:</span>
                            <span className="ml-2 font-bold text-blue-400">₹{currentValue.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
          {/* Total Portfolio Profit/Loss */}
          {(() => {
            const totalInvested = stocks.reduce((total, stock) => {
              const shares = portfolio.shares[stock.id] || 0;
              const avgPrice = portfolio.averagePurchasePrice[stock.id] || 0;
              return total + shares * avgPrice;
            }, 0);
            const totalCurrent = portfolioValue;
            const totalProfitLoss = totalCurrent - totalInvested;
            const totalProfitLossPercent = totalInvested > 0 
              ? (totalProfitLoss / totalInvested) * 100 
              : 0;
            const isTotalProfit = totalProfitLoss >= 0;

            return (
              <div className="mt-4 pt-4 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300 font-medium">Total Profit/Loss:</span>
                  <div className="flex items-center gap-4">
                    <span className="text-gray-400 text-sm">
                      Invested: ₹{totalInvested.toLocaleString()}
                    </span>
                    <span
                      className={`text-lg font-bold ${
                        isTotalProfit ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {isTotalProfit ? "+" : ""}₹{Math.abs(totalProfitLoss).toLocaleString()} ({isTotalProfit ? "+" : ""}{totalProfitLossPercent.toFixed(2)}%)
                    </span>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Stocks List */}
      <div className="bg-black/40 backdrop-blur border border-white/10 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Stocks</h2>
          <button
            onClick={resetGame}
            className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg border border-red-500/50 transition"
          >
            Reset Game
          </button>
        </div>
        <div className="space-y-4">
          {stocks.map((stock) => {
            const ownedShares = portfolio.shares[stock.id] || 0;
            const isPositive = stock.changePercent >= 0;
            return (
              <div
                key={stock.id}
                className="bg-black/20 border border-white/5 rounded-lg p-4 hover:bg-black/30 transition"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Stock Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold">{stock.name}</h3>
                      <span
                        className={`text-sm font-semibold flex items-center gap-1 ${
                          isPositive ? "text-green-400" : "text-red-400"
                        }`}
                      >
                        {isPositive ? "↑" : "↓"}{" "}
                        {Math.abs(stock.changePercent).toFixed(2)}%
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-gray-300">
                        Price: <span className="font-bold text-white">₹{stock.currentPrice}</span>
                      </span>
                      {ownedShares > 0 && (
                        <span className="text-gray-300">
                          Owned: <span className="font-bold text-blue-400">{ownedShares}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="1"
                      placeholder="Qty"
                      value={quantities[stock.id] || ""}
                      onChange={(e) =>
                        setQuantities((prev) => ({
                          ...prev,
                          [stock.id]: e.target.value,
                        }))
                      }
                      className="w-20 px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-white focus:outline-none focus:border-white/30"
                    />
                    <button
                      onClick={() => buyStock(stock.id)}
                      className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg border border-green-500/50 transition font-medium"
                    >
                      Buy
                    </button>
                    <button
                      onClick={() => sellStock(stock.id)}
                      disabled={ownedShares === 0}
                      className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg border border-red-500/50 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Sell
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-black/40 backdrop-blur border border-white/10 rounded-xl p-6">
        <h2 className="text-xl font-bold mb-3">How to Play</h2>
        <ul className="space-y-2 text-gray-300 text-sm">
          <li>• You start with ₹1,00,000 virtual cash</li>
          <li>• Each buy or sell action advances the day and updates stock prices</li>
          <li>• Stock prices change randomly between -5% and +5% each day</li>
          <li>• Prices never go below ₹100</li>
          <li>• Try to maximize your total portfolio value!</li>
        </ul>
      </div>
    </div>
  );
}

