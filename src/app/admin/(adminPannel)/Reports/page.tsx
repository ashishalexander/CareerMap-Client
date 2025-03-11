import React from 'react';
import { Metadata } from 'next';
import DownloadableReports from './components/downloadableReports';
import { Container } from './components/container';

export const metadata: Metadata = {
  title: 'Reports | Dashboard',
  description: 'Generate and download detailed reports for data analysis',
};

export default function ReportsPage() {
  return (
    <>
      <div className="flex items-center justify-between py-6">
        <Container>
          <div className="flex flex-col gap-1">
            <p className="text-muted-foreground">
              Generate and download detailed reports for your data analysis needs
            </p>
          </div>
        </Container>
      </div>
      
      <Container className="pb-10">
        <div className="grid gap-6">
          <DownloadableReports />
        </div>
      </Container>
    </>
  );
}