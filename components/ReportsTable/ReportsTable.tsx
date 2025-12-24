'use client'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { useMutation, useQuery } from 'convex/react'
import { FileText, Loader2, Plus, Trash2, TrendingUp } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { getSpinnerColor } from '@/lib/status-utils'
import StatusBadge from '../StatusBadge/StatusBadge'
import { Button } from '../ui/button'
import { format } from 'date-fns'

const ReportsTable = () => {
    const jobs = useQuery(api.scrapingJobs.getUserJobs)
    const deleteJob = useMutation(api.scrapingJobs.deleteJob)
    const router = useRouter();
    const [deletingJobs, setDeletingJobs] = useState<string | null>(null);


const handleRowClick = (snapshotId: string | undefined) => {
  if (snapshotId) {
    router.push(`/dashboard/report/${snapshotId}`)
  }
};
const handleDelete = async (e: React.MouseEvent, jobId: string) => {
  e.stopPropagation();
  if (
    !confirm(
      "Are you sure you want to delete this report? This actions cannot be undone."
    )
  ) {
    return
  }


  setDeletingJobs(jobId);
  try {
    await deleteJob({jobId: jobId as Id<"scrapingJobs">})
  } catch (error) {
    console.error("Failed to delete job:", error);
alert("Failed to delete report. Please try again.")
  } finally {
    setDeletingJobs(null)
  }
};
// Loading state
  if (!jobs) {
    return (
      <div className='flex flex-col items-center justify-center p-12 text-center'>
        <div className='p-3 mb-4'>
          <Loader2 className='w-6 h-6 animate-spin' />
        </div>
        <h3 className='text-lg font-light mb-2'>Loading Reports</h3>
        <p className='text-sm  font-light'>
          Fetching your latest analysis reports...
        </p>
      </div>
    )
  }

  // Empty state
  if (jobs.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center p-12 text-center'>
        <div className='p-4 mb-6'>
          <FileText className='w-8 h-8 ' />
        </div>
        <h3 className='text-xl font-light mb-2'>No Reports Yet</h3>
        <p className='text-sm  mb-6 max-w-md font-light'>
          Get started by creating your first SEO analysis report. Enter a company name above to begin.
        </p>
        <div className='flex items-center gap-2 text-xs tracking-wider uppercase text-black/60'>
          <div className='w-1.5 h-1.5 rounded-full ' />
          <span>Create your first report to see it here</span>
        </div>
      </div>
    )
  }

  return (
    <div className='w-full'>
      <div className='border-2 border-black/10 overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead>
              <tr className='border-b-2 border-black/10'>
                <th className='text-left px-6 py-4 font-normal text-xs tracking-wider uppercase '>
                  Report
                </th>
                <th className='text-left px-6 py-4 font-normal text-xs tracking-wider uppercase '>
                  Status
                </th>
                <th className='text-left px-6 py-4 font-normal text-xs tracking-wider uppercase '>
                  Created
                </th>
                <th className='text-left px-6 py-4 font-normal text-xs tracking-wider uppercase '>
                  Completed
                </th>
                <th className='text-left px-6 py-4 font-normal text-xs tracking-wider uppercase '>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job, index) => (
                <tr
                  key={job._id}
                  className='cursor-pointer hover:bg-black/[0.02] transition-colors border-b border-black/5 last:border-b-0'
                  onClick={() => handleRowClick(job.snapshotId)}
                >
                  <td className='px-6 py-4 font-light'>
                    <div className='flex items-center gap-3'>
                      <div className='p-1.5 border border-black/10'>
                        <FileText className='w-4 h-4' />
                      </div>
                      <div className='flex-1 min-w-0'>
                        <div className='flex items-center gap-2'>
                          {(job.status === 'pending' || job.status === 'running' || job.status === 'analyzing') && (
                            <Loader2 className={`w-4 h-4 animate-spin ${getSpinnerColor(job.status)}`} />
                          )}
                          <span className='truncate font-normal text-sm'>
                            {job.originalPrompt}
                          </span>
                        </div>
                        {job.snapshotId && (
                          <p className='text-xs  mt-1 tracking-wide'>
                            ID: {job.snapshotId.slice(0, 12)}...
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className='px-6 py-4'>
                    <StatusBadge status={job.status} showIcon={true} />
                  </td>
                  <td className='px-6 py-4 text-sm font-light '>
                    {format(new Date(job.createdAt), 'PPpp')}
                  </td>
                  <td className='px-6 py-4 text-sm font-light '>
                    {job.completedAt ? format(new Date(job.completedAt), 'PPpp') : (
                      <span className='text-black/40'>—</span>
                    )}
                  </td>
                  <td className='px-6 py-4'>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={(e) => handleDelete(e, job._id)}
                      disabled={deletingJobs === job._id}
                      className='h-8 w-8 p-0 hover:bg-black/5 border border-transparent hover:border-black/10 transition-all duration-300'
                    >
                      {deletingJobs === job._id ? (
                        <Loader2 className='h-4 w-4 animate-spin' />
                      ) : (
                        <Trash2 className='h-4 w-4' />
                      )}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Stats */}
      <div className='mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-sm font-light '>
        <div className='flex items-center gap-6'>
          <div className='flex items-center gap-2'>
            <TrendingUp className='w-4 h-4' />
            <span>
              {jobs.length} total report{jobs.length !== 1 ? 's' : ''}
            </span>
          </div>

          {jobs.filter((job) => job.status === 'completed').length > 0 && (
            <div className='flex items-center gap-2'>
              <div className='w-1.5 h-1.5 bg-black rounded-full' />
              <span>
                {jobs.filter((job) => job.status === 'completed').length} completed
              </span>
            </div>
          )}
        </div>
        <div className='text-xs tracking-wider uppercase'>Click any report to view details</div>
      </div>
    </div>
  )

}

export default ReportsTable