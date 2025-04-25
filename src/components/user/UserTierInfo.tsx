import React, { useState, useEffect } from 'react';
import { userService } from '@/services/api/user.service';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  FaDatabase,
  FaFileAlt,
  FaServer,
  FaHistory,
  FaQuestionCircle,
  FaChevronRight,
  FaCrown,
} from 'react-icons/fa';

interface TierData {
  id: number;
  name?: string;
  space_limit: number;
  document_limit: number;
  api_call_limit: number;
  file_size_limit_kb: number;
  query_limit: number;
  query_history_limit: number;
  cost_month: number;
  discount: number;
}

export function UserTierInfo() {
  const [tierData, setTierData] = useState<TierData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const fetchTierInfo = async () => {
      try {
        setIsLoading(true);
        const response = await userService.getUserTier();
        if (response?.tier) {
          setTierData(response.tier);
        } else {
          setTierData(null);
          console.warn(
            'Using default tier since no tier information was received'
          );
        }
      } catch (err) {
        console.error('Failed to fetch tier info:', err);
        setTierData(null);
        console.warn(
          'Using default tier due to error fetching tier information'
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchTierInfo();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-between items-center py-2.5 px-3">
        <div className="flex items-center gap-2">
          <Skeleton className="w-4 h-4 rounded-full" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="w-4 h-4 rounded" />
      </div>
    );
  }

  if (!tierData) {
    return null;
  }

  const limitItems = [
    {
      icon: (
        <FaDatabase className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
      ),
      label: 'Spaces',
      value: tierData.space_limit,
      tooltipText: `Space limit: ${tierData.space_limit}`,
    },
    {
      icon: (
        <FaFileAlt className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
      ),
      label: 'Documents',
      value: tierData.document_limit,
      tooltipText: `Document limit: ${tierData.document_limit}`,
    },
    {
      icon: (
        <FaQuestionCircle className="h-3.5 w-3.5 text-orange-600 dark:text-orange-400" />
      ),
      label: 'Queries',
      value: `${tierData.query_limit}/day`,
      tooltipText: `Query limit: ${tierData.query_limit} per day`,
    },
    {
      icon: (
        <FaHistory className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
      ),
      label: 'History',
      value: tierData.query_history_limit,
      tooltipText: `Query history limit: ${tierData.query_history_limit} records`,
    },
    {
      icon: (
        <FaServer className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
      ),
      label: 'API Calls',
      value: `${tierData.api_call_limit}/day`,
      tooltipText: `API call limit: ${tierData.api_call_limit} per day`,
    },
  ];

  return (
    <>
      <motion.button
        whileHover={{ x: 5 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center rounded-md px-3 py-2.5 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground"
      >
        <motion.span
          animate={isExpanded ? { rotate: [0, 10, -10, 0] } : { rotate: 0 }}
          transition={{ duration: 0.5 }}
        >
          <FaCrown className="mr-2 h-4 w-4 text-amber-500" />
        </motion.span>
        {tierData.cost_month > 0 ? 'Premium Plan' : 'Free Plan'}
        <motion.span
          animate={{ rotate: isExpanded ? 90 : 0 }}
          transition={{ duration: 0.3 }}
          className="ml-auto"
        >
          <FaChevronRight className="h-4 w-4" />
        </motion.span>
      </motion.button>

      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{
          opacity: isExpanded ? 1 : 0,
          height: isExpanded ? 'auto' : 0,
        }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        {isExpanded && (
          <TooltipProvider>
            <div className="ml-6 mt-1 flex flex-col gap-1.5 mb-1">
              {limitItems.map((item, index) => (
                <Tooltip key={index}>
                  <TooltipTrigger asChild>
                    <motion.div
                      variants={{
                        hidden: { opacity: 0, x: -10 },
                        visible: { opacity: 1, x: 0 },
                      }}
                      initial="hidden"
                      animate="visible"
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center justify-between px-3 py-1.5 rounded-md hover:bg-muted cursor-help text-sm"
                    >
                      <div className="flex items-center gap-2">
                        {item.icon}
                        <span className="text-muted-foreground">
                          {item.label}
                        </span>
                      </div>
                      <span className="font-medium">{item.value}</span>
                    </motion.div>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p className="text-xs">{item.tooltipText}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </TooltipProvider>
        )}
      </motion.div>
    </>
  );
}
