'use client'
import { initiateLLM } from '@/actions/initialeLLM';
import StatusBadge from '@/components/StatusBadge/StatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/convex/_generated/api';
import { formateDateTime, getProgressBarStyle, getProgressPercentage, getReportTitle, getStatusMessage } from '@/lib/status-utils';
import {useUser} from '@clerk/nextjs'
import { useQuery } from 'convex/react';
import { AlertCircle, ArrowLeft, BarChart3, Calendar, CheckCircle, FileText, Loader2, XCircle } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation'
import { format } from 'date-fns';
import React, { useState, useTransition } from 'react'

function ReportPage() {
  const {id} = useParams<{id: string}>();
  const {user} = useUser();
  const job = useQuery(api.scrapingJobs.getJobBySnapshotId, {
    snapshotId: id || "skip",
    userId: user?.id || "skip"
  });
  const [isPending, startTransition] = useTransition();
  const [retryError, setRetryError ] = useState<string | null>(null);
  const router = useRouter();
  const handleRetry = () => {
    if (!job) return;

    setRetryError(null);
    startTransition(async () => {
      try {
        const result = await initiateLLM(job.originalPrompt, job._id);
        if (result.ok) {
          if (result.smartRetry) {
            console.log("Smart retry initiated - staying on current page");
            return;
          } else if (result.data?.snapshotId) {
            router.replace(`/dashboard/report/${result.data.snapshotId}`);
            return;
          }
        } else {
          setRetryError(result.error || "Failed to retry job");

        }
      } catch (error) {
        setRetryError( error instanceof Error ? error.message : "Unknown error occured");
      }
    })
  }
  if (!id) {
    return (
      <div className='flex items-center justify-center min-h-screen bg-white'>
        <div className='flex items-center gap-3'>
          <Loader2 className='w-6 h-6 animate-spin' />
          <span className='font-light text-black/60'>Loading...</span>
        </div>
      </div>
    )
  }

  // Loading state - fetching job
  if (job === undefined) {
    return (
      <div className='flex items-center justify-center min-h-screen bg-white'>
        <div className='flex items-center gap-3'>
          <Loader2 className='w-6 h-6 animate-spin' />
          <span className='font-light text-black/60'>Loading report status...</span>
        </div>
      </div>
    )
  }

  // Not found state
  if (job === null) {
    return (
      <div className='flex flex-col items-center justify-center min-h-screen bg-white'>
        <AlertCircle className='w-12 h-12 mb-4 text-black/40' />
        <h2 className='text-2xl font-light mb-2'>Report Not Found</h2>
        <p className='text-sm text-black/60 mb-8'>The report you're looking for doesn't exist</p>
        <Button
          onClick={() => router.push('/dashboard')}
          className='bg-black text-black hover:bg-white hover:text-black border-2 border-black transition-all duration-300 text-xs tracking-widest uppercase'
        >
          Back to Dashboard
        </Button>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-white pt-24'>
      <div className='mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8'>
        <div className='space-y-8'>
          {/* Header */}
          <div className='text-center'>
            <h1 className='text-4xl font-light tracking-tight mb-3 text-black/70'>
              Report Status
            </h1>
            <p className='text-base font-light text-black/70'>
              Track the progress of your SEO report generation
            </p>
          </div>

          {/* Status Card */}
          <Card className='w-full max-w-2xl mx-auto border-2 border-black/10 shadow-none'>
            <CardHeader className='text-center border-b border-black/5'>
              <div className='flex flex-col items-center justify-center mb-4'>
                <StatusBadge status={job.status} showIcon={true} />
              </div>
              <CardTitle className='text-2xl font-light tracking-tight'>
                {getReportTitle(job.status)}
              </CardTitle>
              <CardDescription className='text-base font-light '>
                {getStatusMessage(job.status)}
              </CardDescription>
            </CardHeader>

            <CardContent className='space-y-6 pt-6'>
              {/* Progress Bar */}
              <div className='space-y-3'>
                <div className='flex items-center justify-between text-sm font-light'>
                  <span className=' tracking-wide'>Progress</span>
                  <span className='font-normal'>{getProgressPercentage(job.status)}</span>
                </div>
                <div className='w-full bg-black/5 h-1.5'>
                  <div className={getProgressBarStyle(job.status)} />
                </div>
              </div>

              {/* Job Details */}
              <div className='space-y-4 pt-4 border-t border-black/5'>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                  <div className='flex items-start gap-3'>
                    <FileText className='w-4 h-4  mt-0.5' />
                    <div>
                      <p className='text-sm font-normal mb-1'>Original Query</p>
                      <p className='text-sm  font-light truncate'>
                        {job.originalPrompt}
                      </p>
                    </div>
                  </div>

                  <div className='flex items-start gap-3'>
                    <Calendar className='w-4 h-4  mt-0.5' />
                    <div>
                      <p className='text-sm font-normal mb-1'>Created</p>
                      <p className='text-sm  font-light'>
                                         {format(new Date(job.createdAt), 'PPpp')}
                      </p>
                    </div>
                  </div>
                </div>

                {job.completedAt && (
                  <div className='flex items-start gap-3'>
                    <CheckCircle className='w-4 h-4  mt-0.5' />
                    <div>
                      <p className='text-sm font-normal mb-1'>Completed</p>
                      <p className='text-sm  font-light'>
                    {format(new Date(job.completedAt), 'PPpp')}
                      </p>
                    </div>
                  </div>
                )}

                {job.snapshotId && (
                  <div className='flex items-start gap-3'>
                    <BarChart3 className='w-4 h-4  mt-0.5' />
                    <div>
                      <p className='text-sm font-normal mb-1'>Snapshot ID</p>
                      <p className='text-sm  font-light tracking-wide'>
                        {job.snapshotId}
                      </p>
                    </div>
                  </div>
                )}

                {job.error && (
                  <div className='p-4 bg-black/5 border border-black/10'>
                    <div className='flex items-start gap-2'>
                      <XCircle className='w-4 h-4  mt-0.5 flex-shrink-0' />
                      <div>
                        <p className='text-sm font-normal mb-2'>Error Details</p>
                        <p className='text-sm  font-light'>{job.error}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Results Preview */}
              {job.status === 'completed' && job.results && job.results.length > 0 && (
                <div className='pt-4 border-t border-black/5'>
                  <div className='flex items-center gap-2 mb-3'>
                    <BarChart3 className='w-4 h-4 ' />
                    <p className='text-sm font-normal'>Results Available</p>
                  </div>
                  <div className='p-4 bg-black/5 border border-black/10'>
                    <p className='text-sm  font-light'>
                      Your SEO report is ready for analysis
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
            {job.status === 'completed' && (
              <Button
                onClick={() => router.push(`/dashboard/report/${id}/summary`)}
                className='h-12 px-8 bg-black text-white hover:bg-white hover:text-black border-2 border-black transition-all duration-300 text-xs tracking-widest uppercase'
              >
                View Full Report
              </Button>
            )}

            {job.status === 'failed' && (
              <div className='flex flex-col items-center gap-3'>
                <Button
                  onClick={handleRetry}
                  disabled={isPending}
                  className='h-12 px-8 bg-black text-white hover:bg-white hover:text-black border-2 border-black transition-all duration-300 text-xs tracking-widest uppercase'
                >
                  {isPending ? (
                    <>
                      <Loader2 className='w-4 h-4 animate-spin mr-2 text-white' />
                      Retrying...
                    </>
                  ) : (
                    'Retry Report'
                  )}
                </Button>

                {retryError && (
                  <p className='text-sm text-black/70 font-light text-center'>{retryError}</p>
                )}
              </div>
            )}

            <Button
              onClick={() => router.push('/dashboard')}
              variant='outline'
              className='h-12 px-8 border-2 border-black/10 hover:border-black bg-white transition-all duration-300 text-xs tracking-widest uppercase'
            >
              <ArrowLeft className='w-4 h-4 mr-2 text-black' />
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReportPage