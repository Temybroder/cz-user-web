"use client"

import { Component } from "react"

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
          <p className="mb-4 text-gray-700">{this.state.error?.message || "An unexpected error occurred"}</p>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null })
              window.location.reload()
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Try again
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

















// "use client"

// import { Component } from "react"

// export class ErrorBoundary extends Component {
//   constructor(props) {
//     super(props)
//     this.state = { hasError: false, error: null }
//   }

//   static getDerivedStateFromError(error) {
//     return { hasError: true, error }
//   }

//   componentDidCatch(error, errorInfo) {
//     console.error("Error caught by boundary:", error, errorInfo)
//   }

//   render() {
//     if (this.state.hasError) {
//       return (
//         <div className="min-h-screen flex items-center justify-center bg-gray-50">
//           <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
//             <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
//             <p className="text-gray-600 mb-4">
//               We&apos;re sorry, but there was an error loading this page. Please try refreshing the page.
//             </p>
//             <button
//               onClick={() => this.setState({ hasError: false, error: null })}
//               className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
//             >
//               Try again
//             </button>
//           </div>
//         </div>
//       )
//     }

//     return this.props.children
//   }
// }
