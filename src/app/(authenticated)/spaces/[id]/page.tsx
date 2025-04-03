'use client';
import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { spaceService } from '@/services/api/space.service';
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaFilePdf,
  FaRobot,
} from 'react-icons/fa';

interface Document {
  id: number;
  name: string;
  s3_url: string;
  privacy_status: boolean;
  created_at: string;
}

interface Space {
  id: number;
  name: string;
  description: string;
  privacy_status: boolean;
  created_at: string;
}

export default function SpaceDetailPage() {
  const [space, setSpace] = useState<Space | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;

  const pathname = usePathname();
  const spaceId = pathname?.split('/')[2];

  useEffect(() => {
    if (!spaceId) return;

    const fetchSpaceDetail = async () => {
      try {
        const spaceResponse = await spaceService.getSpaceById(spaceId);
        setSpace(spaceResponse);
        const documentsResponse = await spaceService.getDocumentBySpace(
          spaceId
        );
        setDocuments(documentsResponse.documents);
      } catch (err) {
        setError('Failed to fetch space details');
      } finally {
        setLoading(false);
      }
    };

    fetchSpaceDetail();
  }, [spaceId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-2xl font-semibold text-gray-800">Loading...</p>
      </div>
    );
  }

  const totalPages = Math.ceil(documents.length / itemsPerPage);
  const paginatedDocuments = documents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto relative">
        <div className="bg-background rounded-xl shadow-lg p-6 md:p-10 space-y-6 max-h-[calc(100vh-100px)] overflow-y-auto">
          <h1 className="text-4xl font-extrabold text-center text-primary">
            {space?.name}
          </h1>
          <p className="text-center text-lg text-primary">
            {space?.description}
          </p>

          <div className="flex justify-end gap-6">
            <button className="flex items-center justify-center w-12 h-12 border-2 border-primary text-primary rounded-lg transition-all">
              <FaPlus size={20} />
            </button>
            <button className="flex items-center justify-center w-12 h-12 border-2 border-primary text-primary rounded-lg transition-all">
              <FaRobot size={22} />
            </button>
          </div>
          <div className="mt-6">
            {documents.length === 0 ? (
              <p className="text-center text-gray-500 italic">
                No documents uploaded yet.
              </p>
            ) : (
              <ul className="space-y-4">
                {paginatedDocuments.map((document) => (
                  <li
                    key={document.id}
                    className="border border-gray-200 rounded-lg p-5 flex justify-between items-center shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex items-center space-x-3">
                      <FaFilePdf className="text-red-500 text-2xl" />
                      <div>
                        <h3 className="text-lg font-semibold text-primary">
                          {document.name}
                        </h3>
                        <p className="text-xs text-primary">
                          Uploaded:{' '}
                          {new Date(document.created_at).toLocaleDateString()}
                        </p>
                        <span
                          className={`inline-block px-3 py-1 mt-2 text-xs font-medium rounded-full ${
                            document.privacy_status
                              ? 'bg-red-100 text-red-600'
                              : 'bg-green-100 text-green-600'
                          }`}
                        >
                          {document.privacy_status ? 'Private' : 'Public'}
                        </span>
                      </div>
                    </div>

                    <div className="flex space-x-3">
                      <a
                        href={document.s3_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <button className="p-2 border border-gray-300 rounded-lg  transition-all">
                          <FaEye size={18} />
                        </button>
                      </a>
                      <button className="p-2 border border-gray-300 rounded-lg  transition-all">
                        <FaEdit size={18} />
                      </button>
                      <button className="p-2 border border-gray-300 rounded-lg  transition-all">
                        <FaTrash size={18} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center mt-6 space-x-3">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg text-primary transition-all disabled:opacity-50"
              >
                Prev
              </button>
              <span className="text-primary font-semibold">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg text-primary transition-all disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
