/**
 * Client-side credit event manager
 * Handles real-time credit updates in the UI
 */

export const creditEvents = {
  /**
   * Emit a credit update event to update all UI components
   * @param credits - The new credit balance
   */
  emitUpdate(credits: number) {
    if (typeof window === 'undefined') return
    
    const event = new CustomEvent('credits-updated', {
      detail: { credits },
      bubbles: true,
      cancelable: false
    })
    window.dispatchEvent(event)
  },

  /**
   * Listen for credit updates
   * @param callback - Function to call when credits are updated
   * @returns Cleanup function to remove the listener
   */
  onUpdate(callback: (credits: number) => void): () => void {
    if (typeof window === 'undefined') return () => {}
    
    const handler = (event: Event) => {
      const customEvent = event as CustomEvent<{ credits: number }>
      callback(customEvent.detail.credits)
    }
    
    window.addEventListener('credits-updated', handler)
    
    return () => {
      window.removeEventListener('credits-updated', handler)
    }
  },

  /**
   * Refresh credits from the server and emit update
   */
  async refresh() {
    try {
      const response = await fetch('/api/user/profile')
      if (!response.ok) {
        throw new Error('Failed to fetch credits')
      }
      
      const data = await response.json()
      this.emitUpdate(data.credits || 0)
      
      return data.credits || 0
    } catch (error) {
      console.error('Error refreshing credits:', error)
      return null
    }
  }
}

// Example usage in video generation:
// After successful video generation:
// await creditEvents.refresh() // This will fetch new balance and update all UI components