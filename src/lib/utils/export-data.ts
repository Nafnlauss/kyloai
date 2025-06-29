// Utility functions for exporting data to CSV and Excel formats

export function exportToCSV(data: any[], filename: string) {
  if (!data || data.length === 0) {
    console.error('No data to export')
    return
  }

  // Get headers from first object
  const headers = Object.keys(data[0])
  
  // Create CSV content
  const csvContent = [
    // Headers
    headers.join(','),
    // Data rows
    ...data.map(row => 
      headers.map(header => {
        const value = row[header]
        // Handle values that contain commas or quotes
        if (value === null || value === undefined) return ''
        const stringValue = String(value)
        if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
          return `"${stringValue.replace(/"/g, '""')}"`
        }
        return stringValue
      }).join(',')
    )
  ].join('\n')

  // Create blob and download
  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  
  link.setAttribute('href', url)
  link.setAttribute('download', `${filename}.csv`)
  link.style.visibility = 'hidden'
  
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export function exportToJSON(data: any[], filename: string) {
  if (!data || data.length === 0) {
    console.error('No data to export')
    return
  }

  const jsonContent = JSON.stringify(data, null, 2)
  
  // Create blob and download
  const blob = new Blob([jsonContent], { type: 'application/json' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  
  link.setAttribute('href', url)
  link.setAttribute('download', `${filename}.json`)
  link.style.visibility = 'hidden'
  
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export function formatDataForExport(data: any[], format: 'csv' | 'json' = 'csv') {
  // Clean and format data for export
  return data.map(item => {
    const cleanItem: any = {}
    
    for (const [key, value] of Object.entries(item)) {
      // Skip complex objects
      if (typeof value === 'object' && value !== null && !Array.isArray(value) && !(value instanceof Date)) {
        // Extract important fields from nested objects
        if (key === 'user' && value) {
          cleanItem['userEmail'] = (value as any).email || ''
          cleanItem['userName'] = (value as any).name || ''
        }
        continue
      }
      
      // Format dates
      if (value instanceof Date || (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(value))) {
        cleanItem[key] = new Date(value).toLocaleString('pt-BR')
      } else if (Array.isArray(value)) {
        cleanItem[key] = value.join(', ')
      } else {
        cleanItem[key] = value
      }
    }
    
    return cleanItem
  })
}