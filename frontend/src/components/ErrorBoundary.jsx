import { Component } from "react";
import i18n from "@/i18n";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.error(error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-cream px-6 text-center">
          <h1 className="font-serif text-4xl font-semibold text-leaf">
            {i18n.t("error.title")}
          </h1>
          <p className="mt-3 max-w-md text-stone-600">
            {i18n.t("error.body")}
          </p>
          <button
            data-testid="error-boundary-reload-btn"
            onClick={() => window.location.reload()}
            className="mt-6 min-h-11 rounded-full bg-leaf px-6 py-3 text-sm font-semibold text-cream transition-colors hover:bg-forest"
          >
            {i18n.t("error.refresh")}
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
