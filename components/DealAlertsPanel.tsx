
import React from 'react';
import type { DealAlert } from '../types';
import BellIcon from './icons/BellIcon';
import TrashIcon from './icons/TrashIcon';

interface DealAlertsPanelProps {
  alerts: DealAlert[];
  onRemoveAlert: (alertId: string) => void;
}

const DealAlertsPanel: React.FC<DealAlertsPanelProps> = ({ alerts, onRemoveAlert }) => {
  return (
    <div className="bg-slate-900/70 backdrop-blur-md border border-slate-800 rounded-2xl p-6 flex flex-col">
      <h2 className="text-2xl font-bold text-slate-100 mb-6 flex items-center gap-2">
        <BellIcon className="w-6 h-6 text-cyan-400" />
        Deal Alerts
      </h2>
      <div className="space-y-3 flex-grow overflow-y-auto pr-2 max-h-60">
        {alerts.length === 0 ? (
          <p className="text-slate-500 text-sm text-center pt-8">No active alerts. Click the bell icon on a product to add one.</p>
        ) : (
          alerts.map(alert => (
            <div key={alert.id} className="bg-slate-800/50 p-3 rounded-lg flex justify-between items-center transition-all hover:bg-slate-800">
              <div>
                <p className="font-semibold text-slate-200 text-sm">{alert.productName}</p>
                <p className="text-xs text-slate-400">Alert if price drops below {alert.targetPrice}</p>
              </div>
              <button
                onClick={() => onRemoveAlert(alert.id)}
                className="text-slate-500 hover:text-red-400 transition-colors"
                title="Remove alert"
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DealAlertsPanel;
