import { getMonthlyCount } from "@/api/common";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import moment from "moment";
import { memo, useState } from "react";
import { useQuery } from "react-query";
import ToolTipWrapper from "./ToolTipWrapper";

type DatePickerProps = {
  date: Date | undefined;
  label?: string;
  chatId: number;
  onChange?: (newDate: Date | undefined) => void;
};

function MessageLabel({
  date,
  onChange = () => {},
  label,
  chatId,
}: DatePickerProps) {
  const [trigger, setTrigger] = useState(false);

  const [tempDate, setTempDate] = useState(date);

  const { data: messageCounts = [] } = useQuery({
    queryKey: ["get-message-counts", { trigger }],
    queryFn: () =>
      getMonthlyCount({
        chat_id: chatId,
        month: moment(tempDate).month() + 1,
        year: moment(tempDate).year(),
      }),
    select: (d) => (d.s ? d.r : []),
    refetchOnWindowFocus: false,
  });

  const handleSelect = (selectedDate: Date | undefined) => {
    onChange(selectedDate);
    setTempDate(selectedDate);
  };

  const messageCountMap = new Map(
    messageCounts.map((item) => [
      moment.utc(item.date).local().format("YYYY-MM-DD"),
      item.count,
    ])
  );

  return (
    <Popover
      onOpenChange={(open) => {
        setTrigger(open);
      }}
    >
      <PopoverTrigger>
        <ToolTipWrapper title={moment(date).format("DD MMMM YYYY")}>
          <div className="text-center text-[#fdfdfd] bg-black text-sm px-4 py-1 rounded-xl cursor-pointer">
            {label}
          </div>
        </ToolTipWrapper>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-0 bg-transparent backdrop-blur-3xl border-none"
        align="center"
      >
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          onMonthChange={(date) => {
            handleSelect(date);
            setTrigger(!trigger);
          }}
          initialFocus
          components={{
            DayContent: ({ date: dayDate }) => {
              const formattedDate = moment(dayDate).format("YYYY-MM-DD");

              const count = messageCountMap.get(formattedDate);

              if (count) {
                return (
                  <ToolTipWrapper title={count + " messages"}>
                    <div className="relative w-full h-full flex flex-col items-center justify-center -ml-[.1rem]">
                      <span>{dayDate.getDate()}</span>
                      <span className="size-1 bg-white rounded-full"></span>
                    </div>
                  </ToolTipWrapper>
                );
              }

              return <div className="-ml-[.1rem]">{dayDate.getDate()}</div>;
            },
          }}
        />
      </PopoverContent>
    </Popover>
  );
}

export default memo(MessageLabel, (prevProps, nextProps) => {
  return prevProps.chatId === nextProps.chatId;
});
