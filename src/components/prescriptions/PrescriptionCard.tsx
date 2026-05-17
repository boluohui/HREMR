import { Link } from 'react-router-dom';
import { Calendar, Pill, ChevronRight } from 'lucide-react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import { formatDate } from '../../utils/formatters';
import type { Prescription } from '../../utils/types';

interface PrescriptionCardProps {
  prescription: Prescription;
}

export default function PrescriptionCard({ prescription }: PrescriptionCardProps) {
  return (
    <Link to={`/prescriptions/${prescription.id}`}>
      <Card hover padding="none">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center">
                <Pill className="w-6 h-6 text-accent-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  {prescription.diagnosis || '处方'}
                </h3>
                <p className="text-sm text-gray-500">
                  {prescription.medications.length} 种药品
                </p>
              </div>
            </div>
            <Badge variant={prescription.isActive ? 'success' : 'gray'}>
              {prescription.isActive ? '进行中' : '已完成'}
            </Badge>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(prescription.prescriptionDate)}</span>
            {prescription.hospital && (
              <>
                <span className="text-gray-300">|</span>
                <span>{prescription.hospital}</span>
              </>
            )}
          </div>

          <div className="space-y-2 mb-4">
            {prescription.medications.slice(0, 2).map((med, index) => (
              <div key={index} className="text-sm text-gray-700">
                <span className="font-medium">{med.name}</span>
                <span className="text-gray-500 ml-2">{med.dosage}</span>
              </div>
            ))}
            {prescription.medications.length > 2 && (
              <p className="text-sm text-gray-500">
                还有 {prescription.medications.length - 2} 种药品...
              </p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              {prescription.reminders.some((r) => r.enabled) && (
                <Badge variant="warning">已设置提醒</Badge>
              )}
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
        </div>
      </Card>
    </Link>
  );
}
