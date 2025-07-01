export const fetchPopulationData = async () => {
  try {
    const response = await fetch('https://datausa.io/api/data?drilldowns=Nation&measures=Population');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const result = await response.json();
    return result;
  } catch (error) {
    throw error;
}
};