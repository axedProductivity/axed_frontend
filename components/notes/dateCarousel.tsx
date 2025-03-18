import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Modal,
  SafeAreaView,
} from "react-native";
import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel";
import { Calendar } from "react-native-calendars";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface DateData {
  date: Date;
  isToday: boolean;
}

interface DateCarouselProps {
  onDateChange: (date: Date) => void;
  initialDate?: Date;
}

const formatDateCompact = (
  date: Date
): { month: string; dayName: string; dayNum: string } => {
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return {
    month: monthNames[date.getMonth()],
    dayName: dayNames[date.getDay()],
    dayNum: date.getDate().toString(),
  };
};

const formatYYYYMMDD = (date: Date): string => {
  return date.toISOString().split("T")[0];
};

// Create a new date without timezone issues
const createLocalDate = (dateString: string): Date => {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day, 0, 0, 0, 0);
};

const generateDateRange = (centerDate: Date): DateData[] => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dates: DateData[] = [];

  for (let i = -7; i < 0; i++) {
    const date = new Date(centerDate);
    date.setDate(centerDate.getDate() + i);
    dates.push({
      date,
      isToday: date.getTime() === today.getTime(),
    });
  }

  dates.push({
    date: new Date(centerDate),
    isToday: centerDate.getTime() === today.getTime(),
  });

  for (let i = 1; i <= 7; i++) {
    const date = new Date(centerDate);
    date.setDate(centerDate.getDate() + i);
    dates.push({
      date,
      isToday: date.getTime() === today.getTime(),
    });
  }

  return dates;
};

const DateCarousel: React.FC<DateCarouselProps> = ({
  onDateChange,
  initialDate,
}) => {
  const carouselRef = useRef<ICarouselInstance>(null);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [dates, setDates] = useState<DateData[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(7);
  const [todayIndex, setTodayIndex] = useState<number>(7);
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(initialDate || today);
  const [centerDate, setCenterDate] = useState(today);

  useEffect(() => {
    const newDates = generateDateRange(centerDate);
    setDates(newDates);

    const todayIdx = newDates.findIndex((item) => item.isToday);
    if (todayIdx !== -1) {
      setTodayIndex(todayIdx);
    }

    const selectedIdx = newDates.findIndex(
      (item) => item.date.toDateString() === selectedDate.toDateString()
    );

    if (selectedIdx !== -1) {
      setCurrentIndex(selectedIdx);
    } else {
      setCurrentIndex(7);
    }
  }, [centerDate]);

  useEffect(() => {
    if (carouselRef.current && dates.length > 0) {
      setTimeout(() => {
        if (carouselRef.current) {
          carouselRef.current.scrollTo({
            index: currentIndex,
            animated: false,
          });
        }
      }, 100);
    }
  }, [dates, currentIndex]);

  const handleDateChange = (index: number) => {
    if (index >= 0 && index < dates.length) {
      setCurrentIndex(index);
      setSelectedDate(dates[index].date);
      onDateChange(dates[index].date);
    }
  };

  // Handle date selection from calendar
  const handleCalendarDateSelect = (date: any) => {
    // Fix timezone issues by creating a local date
    const localDate = createLocalDate(date.dateString);

    setCenterDate(localDate);
    setSelectedDate(localDate);
    onDateChange(localDate);
    setCalendarVisible(false);
  };

  const goToToday = () => {
    setCenterDate(today);
    setSelectedDate(today);
    onDateChange(today);
  };

  const renderDateCard = ({
    item,
    index,
  }: {
    item: DateData;
    index: number;
  }) => {
    const isSelected = index === currentIndex;
    const { month, dayName, dayNum } = formatDateCompact(item.date);

    return (
      <View
        style={[
          styles.dateCard,
          item.isToday && styles.todayCard,
          isSelected && styles.selectedDateCard,
        ]}
      >
        <Text
          style={[
            styles.monthText,
            item.isToday && styles.todayText,
            isSelected && styles.selectedText,
          ]}
        >
          {month}
        </Text>
        <Text
          style={[
            styles.dayNumText,
            item.isToday && styles.todayText,
            isSelected && styles.selectedText,
          ]}
        >
          {dayNum}
        </Text>
        <Text
          style={[
            styles.dayNameText,
            item.isToday && styles.todayText,
            isSelected && styles.selectedText,
          ]}
        >
          {dayName}
        </Text>
      </View>
    );
  };

  const getMarkedDates = () => {
    const markedDates: any = {};

    markedDates[formatYYYYMMDD(selectedDate)] = {
      selected: true,
      selectedColor: "#4866fe",
    };

    if (formatYYYYMMDD(today) !== formatYYYYMMDD(selectedDate)) {
      markedDates[formatYYYYMMDD(today)] = {
        marked: true,
        dotColor: "#4866fe",
      };
    }

    return markedDates;
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        {selectedDate.toDateString() !== today.toDateString() && (
          <TouchableOpacity style={styles.todayButton} onPress={goToToday}>
            <Text style={styles.todayButtonText}>Today</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.calendarButton}
          onPress={() => setCalendarVisible(true)}
        >
          <Text style={styles.calendarButtonText}>Calendar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.carouselContainer}>
        <Carousel
          ref={carouselRef}
          loop={false}
          style={styles.carousel}
          width={SCREEN_WIDTH / 4}
          height={90}
          autoPlay={false}
          data={dates}
          scrollAnimationDuration={300}
          onSnapToItem={handleDateChange}
          renderItem={renderDateCard}
          defaultIndex={currentIndex}
          mode="parallax"
          modeConfig={{
            parallaxScrollingScale: 0.9,
            parallaxScrollingOffset: 40,
          }}
        />
      </View>

      <Modal
        visible={calendarVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setCalendarVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.calendarContainer}>
            <View style={styles.calendarHeader}>
              <Text style={styles.calendarTitle}>Select Date</Text>
              <TouchableOpacity
                onPress={() => setCalendarVisible(false)}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>

            <Calendar
              current={formatYYYYMMDD(selectedDate)}
              markedDates={getMarkedDates()}
              onDayPress={handleCalendarDateSelect}
              theme={{
                backgroundColor: "#23294d",
                calendarBackground: "#23294d",
                textSectionTitleColor: "#ffffff",
                selectedDayBackgroundColor: "#4866fe",
                selectedDayTextColor: "#ffffff",
                todayTextColor: "#4866fe",
                dayTextColor: "#ffffff",
                textDisabledColor: "#666666",
                monthTextColor: "#ffffff",
                arrowColor: "#4866fe",
              }}
            />
          </View>
        </SafeAreaView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
  },
  carouselContainer: {
    width: "100%",
    alignItems: "center",
    marginVertical: 10,
  },
  carousel: {
    width: SCREEN_WIDTH,
  },
  dateCard: {
    width: SCREEN_WIDTH / 4 - 30,
    height: 80,
    borderRadius: 12,
    backgroundColor: "rgba(11, 14, 30, 0.6)",
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
    marginHorizontal: 15,
  },
  selectedDateCard: {
    backgroundColor: "#4866fe", // Blue fill for selected date
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.5)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  todayCard: {
    backgroundColor: "rgba(11, 14, 30, 0.8)",
    borderWidth: 2,
    borderColor: "#4866fe", // Blue border for today's date
  },
  monthText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "500",
    marginBottom: 2,
  },
  dayNumText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 2,
  },
  dayNameText: {
    color: "#FFFFFF",
    fontSize: 12,
    opacity: 0.8,
  },
  todayText: {
    color: "#4866fe",
    fontWeight: "bold",
  },
  selectedText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 2,
    width: "100%",
    gap: 4,
  },
  todayButton: {
    backgroundColor: "#4866fe",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  todayButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  calendarButton: {
    backgroundColor: "rgba(72, 102, 254, 0.2)",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#4866fe",
  },
  calendarButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  calendarContainer: {
    width: "90%",
    backgroundColor: "#23294d",
    borderRadius: 15,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  calendarHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  calendarTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    color: "#4866fe",
    fontWeight: "bold",
  },
});

export default DateCarousel;
