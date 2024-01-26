import { graphLinesColors } from 'constants/graphs/graphLinesColors';
import { convertDateForGraphs } from 'helpers/general/dateHelper';
import { getThemeColorByVarName } from 'helpers/general/getThemeColorByVarName';
import { images } from 'images';

const returnTooltipPartContent = (itemValue, itemName) => {
    return `
    <div style="width:max-content; padding:0; margin:0; display:flex;column-gap:5px;">
        <div style="color: var(--grey);">${itemValue}:</div>
        <div style="color: var(--text);">${itemName}</div>
    </div>
    `;
};

export const buildTooltipContent = (itemArray) => {
    let content = '';

    itemArray.forEach((item) => {
        const itemName = item.name;
        const itemValue = convertDateForGraphs(item.value);
        content += returnTooltipPartContent(itemValue, itemName);
    });
    return content;
};

const resolveAlertImage = (alertCount) => {
    return alertCount > 1 ? images.multipleAlert : images.alertSvg;
};

export const buildDataURIImage = (alertCount) => {
    return `image:/${resolveAlertImage(alertCount)}`;
};

export const extractFilters = (inputObject) => {
    const filtersArray = [];
    for (const key in inputObject) {
        if (key.startsWith('filter')) {
            filtersArray.push(inputObject[key]);
        }
    }

    return filtersArray;
};

export const verifyParameterLineColor = (lineParameterName, template) => {
    return getThemeColorByVarName(graphLinesColors[`t_${template}`][lineParameterName]);
};
