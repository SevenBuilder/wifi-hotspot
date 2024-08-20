import moment from 'moment';

export const replaceMongoIdInArray = (array = []) => {
    if (!Array.isArray(array)) {
        throw new TypeError('Expected an array');
    }

    return array.map((item) => {
        const { _id, ...rest } = item;
        return {
            id: _id.toString(),
            ...rest
        };
    });
};

export const replaceMongoIdInObject = (obj) => {
    if (!obj) return null;
    const { _id, ...updatedObj } = { ...obj, id: obj._id.toString() };
    return updatedObj;
};

export const formatBytes = (bytes) => {
    if (bytes === '0' || !bytes) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    const formattedValue = parseFloat((bytes / Math.pow(k, i)).toFixed(2));

    return `${formattedValue} ${sizes[i]}`;
};

export const calculateProgress = (startDateString, totalDays) => {
    const startDate = new Date(startDateString);
    const currentDate = new Date();

    // Calculate time difference in milliseconds
    const timeDiff = startDate - currentDate;

    let progressValue, remainingTime, timePassed;

    if (totalDays === 1) {
        // Calculate hours passed
        const hoursPassed = Math.floor(timeDiff / (1000 * 60 * 60));
        const totalHours = 24;

        // Calculate progress percentage and hours left
        progressValue = parseInt(Math.min((hoursPassed / totalHours) * 100, 100));
        remainingTime = Math.max(totalHours - hoursPassed, 0);
        timePassed = hoursPassed;

        return {
            progressValue,
            remaining: timePassed,
            passed: remainingTime
        };
    } else {
        // Calculate days passed
        const daysPassed = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

        // Calculate progress percentage and days left
        progressValue = parseInt(Math.min((daysPassed / totalDays) * 100, 100));
        remainingTime = Math.max(totalDays - daysPassed, 0);
        timePassed = daysPassed;

        return {
            progressValue,
            remaining: timePassed,
            passed: remainingTime
        };
    }
};

export const getExpirationDate = (days) => {
    const now = new Date();
    const expirationDate = new Date(now);

    expirationDate.setDate(now.getDate() + days);

    return expirationDate;
};

export const calculateDiscountedPrice = (originalPrice, discountPercentage) => {
    if (originalPrice < 0 || discountPercentage < 0) {
        return 0;
    }

    const discountAmount = (originalPrice * discountPercentage) / 100;
    const finalPrice = parseInt(originalPrice - discountAmount);

    return finalPrice;
};

export const convertToUTCPlus6 = (date) => {
    // Create a moment object from the date
    const momentDate = moment.utc(date);

    // Add 6 hours to convert to UTC +6
    const utcPlus6Date = momentDate.utcOffset(6);

    return utcPlus6Date;
};
