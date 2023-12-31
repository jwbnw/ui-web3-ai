import Link from "next/link";
import { FC, useState } from "react";

export const PaymentPresenter: React.FC = () => {
  return (
    <div className="stats text-primary-content">
      <div className="stat bg-transparent">
        <div className="stat-title">Estimated Price USDC</div>
        <div className="stat-value">$.09</div>
        <div className="stat-actions">
        </div>
      </div>

      <div className="stat bg-transparent">
        <div className="stat-title">Estimated Price SOL</div>
        <div className="stat-value">.004</div>
        <div className="stat-actions">
        </div>
      </div>
    </div>
  );
};
