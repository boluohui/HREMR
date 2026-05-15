import { Link } from 'react-router-dom';
import { Calendar, MapPin, Stethoscope, ChevronRight } from 'lucide-react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import { formatDate } from '../../utils/formatters';
import type { MedicalRecord } from '../../utils/types';

interface RecordCardProps {
  record: MedicalRecord;
}

export default function RecordCard({ record }: RecordCardProps) {
  return (
    <Link to={`/records/${record.id}`}>
      <Card hover padding="none">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <Stethoscope className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{record.diagnosis}</h3>
                <p className="text-sm text-gray-500">{record.department}</p>
              </div>
            </div>
            <Badge variant="gray">{formatDate(record.recordDate)}</Badge>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(record.recordDate)}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>{record.hospital}</span>
            </div>
          </div>

          <p className="text-sm text-gray-600 line-clamp-2 mb-4">
            {record.chiefComplaint}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              {record.attachments.length > 0 && (
                <Badge variant="secondary">
                  {record.attachments.length} 个附件
                </Badge>
              )}
              {record.followUpDate && (
                <Badge variant="warning">需复诊</Badge>
              )}
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
        </div>
      </Card>
    </Link>
  );
}
