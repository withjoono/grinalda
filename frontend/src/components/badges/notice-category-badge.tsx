import { NoticeCategory } from '@/apis/hooks/use-boards';
import { Badge } from '../ui/badge';

export const NoticeCategoryBadge = ({
  category,
}: {
  category: NoticeCategory;
}) => {
  return (
    <Badge
      style={{
        backgroundColor: category.backgroundColor,
        color: category.textColor,
      }}
    >
      {category.name}
    </Badge>
  );
};
