import { Component, ReactNode } from 'react'

interface Props {
  children: ReactNode
  mfeName: string
  port: string
}

interface State {
  hasError: boolean
  error: Error | null
}

export default class MFEErrorBoundary
  extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center
                        min-h-96">
          <div className="bg-gray-900 border border-red-500/20
                          rounded-xl p-8 text-center max-w-md">
            <div className="text-4xl mb-4">⚠️</div>
            <h3 className="text-white font-semibold mb-2">
              {this.props.mfeName} unavailable
            </h3>
            <p className="text-gray-400 text-sm mb-2">
              Make sure the app is running on port{' '}
              <code className="text-indigo-400">
                {this.props.port}
              </code>
            </p>
            <p className="text-gray-600 text-xs font-mono mb-4">
              {this.state.error?.message}
            </p>
            <button
              onClick={() =>
                this.setState({ hasError: false, error: null })
              }
              className="px-4 py-2 bg-gray-800 text-gray-300
                         rounded-lg text-sm hover:bg-gray-700
                         transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
