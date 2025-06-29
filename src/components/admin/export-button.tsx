'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Download, FileText, FileSpreadsheet, Loader2 } from 'lucide-react'
import { exportToCSV, exportToJSON, formatDataForExport } from '@/lib/utils/export-data'

interface ExportButtonProps {
  data: any[]
  filename: string
  onExport?: (format: 'csv' | 'json') => Promise<any[]> | any[]
  disabled?: boolean
  variant?: 'default' | 'outline' | 'secondary' | 'ghost'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

export function ExportButton({
  data,
  filename,
  onExport,
  disabled = false,
  variant = 'outline',
  size = 'default'
}: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async (format: 'csv' | 'json') => {
    try {
      setIsExporting(true)
      
      // Get data to export
      let exportData = data
      if (onExport) {
        exportData = await onExport(format)
      }

      // Format data
      const formattedData = formatDataForExport(exportData, format)

      // Export based on format
      if (format === 'csv') {
        exportToCSV(formattedData, filename)
      } else {
        exportToJSON(formattedData, filename)
      }
    } catch (error) {
      console.error('Export error:', error)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          size={size}
          disabled={disabled || isExporting || (!data || data.length === 0)}
        >
          {isExporting ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Download className="h-4 w-4 mr-2" />
          )}
          Exportar
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Formato de exportação</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleExport('csv')}>
          <FileSpreadsheet className="h-4 w-4 mr-2" />
          Exportar como CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('json')}>
          <FileText className="h-4 w-4 mr-2" />
          Exportar como JSON
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}