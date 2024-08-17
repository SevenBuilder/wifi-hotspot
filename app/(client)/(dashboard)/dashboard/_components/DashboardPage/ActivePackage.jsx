import { Progress } from "@/components/ui/progress"
import { calculateProgress } from "@/lib/convertData";
import { ArrowDownUp, Wifi } from "lucide-react";
import moment from "moment";

const ActivePackage = ({ activeInfo }) => {
    const {
        uploadUsages = 0,
        downloadUsages = 0,
        totalUploadUsages = 0,
        totalDownloadUsages = 0,
        packages
    } = activeInfo;

    const validity = packages?.packageId?.validity;
    const { progressValue, remaining } = calculateProgress(packages?.expiresAt, validity);

    return (
        <div className="p-4 mx-5 mt-4 bg-white shadow dark:shadow-gray-700 dark:bg-gray-950 rounded-xl">
            <div className="flex items-center justify-between">
                <div className="font-semibold">Expired Date</div>
                <div className="text-sm font-medium text-muted-foreground">
                    {moment(packages?.expiresAt).format('MMM DD YYYY, h:mm:ss a')}
                </div>
            </div>
            <div className="mt-2">
                <Progress value={progressValue} className="w-full h-3 bg-gray-200" />
                <div className="flex justify-between mt-2 text-sm">
                    <div className="font-medium">
                        {validity === 1 ? "24 Hours" : validity + " Days"}
                    </div>
                    <div className="font-medium">
                        {validity === 1 ? remaining + " Hours" : remaining + " Days"} Left
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4 text-center">
                <div>
                    <Wifi className="w-6 h-6 mx-auto" />
                    <div className="mt-1 text-sm">Current Using</div>
                    <div className="text-xs text-muted-foreground">{uploadUsages}/{downloadUsages}</div>
                </div>
                <div>
                    <ArrowDownUp className="w-6 h-6 mx-auto" />
                    <div className="mt-1 text-sm">Total Usages</div>
                    <div className="text-xs text-muted-foreground">{totalUploadUsages}/{totalDownloadUsages}</div>
                </div>
            </div>
        </div>
    );
};

export default ActivePackage;