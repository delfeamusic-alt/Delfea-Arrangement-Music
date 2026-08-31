import React, { ErrorInfo, ReactNode } from 'react';
import { RefreshCw, AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in component tree:', error, errorInfo);
  }

  private handleReset = () => {
    try {
      localStorage.removeItem('delfea_music_portfolio_v1');
      localStorage.removeItem('delfea_site_settings_v1');
      sessionStorage.clear();
    } catch {
      // ignore
    }
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0D0E12] text-white flex items-center justify-center p-6 text-center">
          <div className="max-w-md w-full p-8 rounded-2xl glass-panel border border-[#FFC857]/40 shadow-2xl space-y-5">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center mx-auto text-[#FFC857]">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold font-serif-heading text-white">Delfea Studio App</h2>
              <p className="text-xs text-gray-300">
                Terjadi kesalahan sementara pada tampilan. Silakan muat ulang untuk melanjutkan.
              </p>
            </div>
            <div className="pt-2 flex flex-col gap-3">
              <button
                type="button"
                onClick={() => this.setState({ hasError: false, error: null })}
                className="w-full py-3 rounded-xl bg-[#FFC857] text-[#0D0E12] font-bold text-sm hover:bg-[#FFAA00] transition-all flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Coba Kembali</span>
              </button>
              <button
                type="button"
                onClick={this.handleReset}
                className="w-full py-2.5 rounded-xl bg-white/10 text-xs text-gray-300 hover:text-white hover:bg-white/15 transition-all"
              >
                Reset Data & Muat Ulang
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
