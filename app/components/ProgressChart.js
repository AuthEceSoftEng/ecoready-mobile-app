import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Line, Circle, Text as SvgText, Polyline } from 'react-native-svg';
import { formatDateDM } from '../utils/dateFormatter';

const { width: screenWidth } = Dimensions.get('window');
const CHART_WIDTH = screenWidth - 60;
const CHART_HEIGHT = 200;
const PADDING = 40;

const ProgressChart = ({ quizHistory }) => {
  if (!quizHistory || quizHistory.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No quiz data yet</Text>
        <Text style={styles.emptySubtext}>Complete your first quiz to see your progress!</Text>
      </View>
    );
  }

  // Prepare data - get last 10 quizzes
  const recentQuizzes = quizHistory.slice(-10);
  const scores = recentQuizzes.map(quiz => quiz.score);
  const maxScore = 10; // Maximum possible score

  // Calculate chart dimensions
  const chartWidth = CHART_WIDTH - (PADDING * 2);
  const chartHeight = CHART_HEIGHT - (PADDING * 2);

  // Calculate positions for each point
  const points = scores.map((score, index) => {
    const x = PADDING + (index * (chartWidth / (scores.length - 1 || 1)));
    const y = PADDING + chartHeight - (score / maxScore) * chartHeight;
    return { x, y, score };
  });

  // Create polyline points string for the line
  const polylinePoints = points.map(p => `${p.x},${p.y}`).join(' ');

  // Format date for labels
  const displayDate = (dateString) => formatDateDM(dateString);

  return (
    <View style={styles.container}>
      <Text style={styles.chartTitle}>Score Progression</Text>
      <Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
        {/* Horizontal grid lines */}
        {[0, 2, 4, 6, 8, 10].map((value) => {
          const y = PADDING + chartHeight - (value / maxScore) * chartHeight;
          return (
            <React.Fragment key={value}>
              <Line
                x1={PADDING}
                y1={y}
                x2={CHART_WIDTH - PADDING}
                y2={y}
                stroke="#e0e0e0"
                strokeWidth="1"
                strokeDasharray="4,4"
              />
              <SvgText
                x={PADDING - 25}
                y={y + 5}
                fontSize="12"
                fill="#666"
                textAnchor="middle"
              >
                {value}
              </SvgText>
            </React.Fragment>
          );
        })}

        {/* X and Y axes */}
        <Line
          x1={PADDING}
          y1={PADDING}
          x2={PADDING}
          y2={CHART_HEIGHT - PADDING}
          stroke="#333"
          strokeWidth="2"
        />
        <Line
          x1={PADDING}
          y1={CHART_HEIGHT - PADDING}
          x2={CHART_WIDTH - PADDING}
          y2={CHART_HEIGHT - PADDING}
          stroke="#333"
          strokeWidth="2"
        />

        {/* Plot line */}
        {points.length > 1 && (
          <Polyline
            points={polylinePoints}
            fill="none"
            stroke="#4CAF50"
            strokeWidth="3"
          />
        )}

        {/* Plot points */}
        {points.map((point, index) => (
          <React.Fragment key={index}>
            <Circle
              cx={point.x}
              cy={point.y}
              r="6"
              fill="#2E7D32"
              stroke="#fff"
              strokeWidth="2"
            />
            {/* Date labels (show every other label if too many points) */}
            {(scores.length <= 5 || index % 2 === 0) && (
              <SvgText
                x={point.x}
                y={CHART_HEIGHT - PADDING + 20}
                fontSize="10"
                fill="#666"
                textAnchor="middle"
              >
                {displayDate(recentQuizzes[index].date)}
              </SvgText>
            )}
          </React.Fragment>
        ))}
      </Svg>
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#2E7D32' }]} />
          <Text style={styles.legendText}>Quiz Score (out of 10)</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginVertical: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E4E75',
    marginBottom: 15,
    textAlign: 'center',
  },
  emptyContainer: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 30,
    alignItems: 'center',
    marginVertical: 10,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    color: '#666',
  },
});

export default ProgressChart;
