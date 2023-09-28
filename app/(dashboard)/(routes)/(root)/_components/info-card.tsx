import IconBadge from "@/components/icon-badge";
import {LucideIcon} from "lucide-react";
type Props = {
  noOfItems: number;
  variant?: "default" | "sucess";
  label: string;
  icon: LucideIcon;
};

function InfoCard({variant, icon: Icon, label, noOfItems}: Props) {
  return (
    <div className="border rounded-md flex items-center gap-x-2 p-3">
      <IconBadge variant={variant} icon={Icon} />
      <div>
        <p className="font-medium">{label}</p>
        <p className="text-gray-500 text-sm">
          {noOfItems}{" "}
          {noOfItems === 0 ? "Courses" : noOfItems === 1 ? "Course" : "Courses"}
        </p>
      </div>
    </div>
  );
}

export default InfoCard;
