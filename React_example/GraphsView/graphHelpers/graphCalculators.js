export const calculateUniqueMeasurementUnits = (seriesData) => {
    const uniqueMeasurementUnits = [];
    seriesData.forEach((element) => {
        const existingUnitIndex = uniqueMeasurementUnits.findIndex(
            (item) => item.measurementUnit === element.measurementUnit
        );

        if (existingUnitIndex !== -1) {
            uniqueMeasurementUnits[existingUnitIndex].isNoData =
                uniqueMeasurementUnits[existingUnitIndex].isNoData && element.isNoData;
        } else {
            uniqueMeasurementUnits.push({
                measurementUnit: element.measurementUnit,
                maxValue: element.maxValue,
                isNoData: element.isNoData,
            });
        }
    });

    return uniqueMeasurementUnits;
};

export const incrementSidesIndexes = (index, leftIndex, rightIndex) => {
    if (index === 0 || index === 1) {
        //
    } else if (index % 3 === 0) {
        leftIndex++;
    } else {
        rightIndex++;
    }
    return { leftIndex, rightIndex };
};

export const calculateStartPaddings = (uniqueMeasurementUnits) => {
    let leftPadding = 55,
        rightPadding = 55;
    for (let i = 0; i < uniqueMeasurementUnits.length; i++) {
        if (uniqueMeasurementUnits[i].isNoData) {
            if (i === 0) {
                leftPadding += 30;
            } else if (i === 1) {
                rightPadding += 30;
            } else if (i % 3 === 0) {
                leftPadding += 30;
            } else {
                rightPadding += 30;
            }
        }
    }

    return { leftPadding, rightPadding };
};

export const calculateOffset = (index, leftIndex, rightIndex) => {
    if (index === 0 || index === 1) return 0;
    if (index % 3 === 0) {
        return 100 * leftIndex;
    }
    return 100 * rightIndex;
};

export const calculateGridPaddings = (seriesData) => {
    let leftPaddingCount = 0;
    let rightPaddingCount = 0;
    const tempSeriasData = seriesData.sort((a, b) => {
        const hasPercentageA = a.name.includes('%');
        const hasPercentageB = b.name.includes('%');

        if (hasPercentageA && !hasPercentageB) {
            return -1;
        } else if (!hasPercentageA && hasPercentageB) {
            return 1;
        }

        return 0;
    });
    const uniqueMeasurementUnits = calculateUniqueMeasurementUnits(tempSeriasData);
    const startPaddings = calculateStartPaddings(uniqueMeasurementUnits);
    for (let i = 0; i < uniqueMeasurementUnits.length; i++) {
        const incrementedIndexes = incrementSidesIndexes(i, leftPaddingCount, rightPaddingCount);
        leftPaddingCount = incrementedIndexes.leftIndex;
        rightPaddingCount = incrementedIndexes.rightIndex;
    }

    return {
        left: startPaddings.leftPadding + leftPaddingCount * 45,
        right: startPaddings.rightPadding + rightPaddingCount * 80,
    };
};
