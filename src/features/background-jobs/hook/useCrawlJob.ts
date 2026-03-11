import { useState } from "react";
import backgroundJobApi from "../../../api/backgroundJob.api";
import { toast } from "sonner";

export const useCrawlJob = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startJob = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await backgroundJobApi.startCrawlArticle();

      if (response.code === 200) {
        setIsRunning(true);
        toast.success("Crawl job started successfully!");
      } else {
        setError(response.message || "Failed to start crawl job");
        toast.error(response.message || "Failed to start crawl job");
      }
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        "Failed to start crawl job";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const stopJob = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await backgroundJobApi.stopCrawlArticle();

      if (response.code === 200) {
        setIsRunning(false);
        toast.success("Crawl job stopped successfully!");
      } else {
        setError(response.message || "Failed to stop crawl job");
        toast.error(response.message || "Failed to stop crawl job");
      }
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        "Failed to stop crawl job";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isRunning,
    isLoading,
    error,
    startJob,
    stopJob,
    setIsRunning,
  };
};

export default useCrawlJob;
