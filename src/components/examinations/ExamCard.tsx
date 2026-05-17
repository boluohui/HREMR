import { Link } from 'react-router-dom';
import { Calendar, ChevronRight } from 'lucide-react';
import { TestTube, Image as ImageIcon, Heart, Activity } from 'lucide-react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import { formatDate, getExamTypeLabel } from '../../utils/formatters';
import type { Examination, ExamType } from '../../utils/types';

interface ExamCardProps {
  exam: Examination;
}

const examTypeIcons: Record<ExamType, typeof TestTube> = {
  blood: TestTube,
  urine: TestTube,
  imaging: ImageIcon,
  ultrasound: Activity,
  ecg: Heart,
  other: Activity,
};

export default function ExamCard({ exam }: ExamCardProps) {
  const Icon = examTypeIcons[exam.examType] || Activity;

  return (
    <Link to={`/examinations/${exam.id}`}>
      <Card hover padding="none">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center">
                <Icon className="w-6 h-6 text-secondary-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{exam.title}</h3>
                <p className="text-sm text-gray-500">{getExamTypeLabel(exam.examType)}</p>
              </div>
            </div>
            <Badge variant="secondary">{formatDate(exam.examDate)}</Badge>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(exam.examDate)}</span>
          </div>

          {exam.conclusion && (
            <p className="text-sm text-gray-600 line-clamp-2 mb-4">
              {exam.conclusion}
            </p>
          )}

          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              {exam.attachments.length > 0 && (
                <Badge variant="primary">
                  {exam.attachments.length} 个附件
                </Badge>
              )}
              {exam.normalRanges && exam.normalRanges.length > 0 && (
                <Badge variant="gray">
                  {exam.normalRanges.length} 项指标
                </Badge>
              )}
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
        </div>
      </Card>
    </Link>
  );
}
