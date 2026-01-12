import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  ScrollView,
} from 'react-native';

// Update this to your RSS API server URL
const RSS_API_BASE_URL = 'https://issel01.ee.auth.gr/api/news';

const NewsScreen = () => {
  const [activeTab, setActiveTab] = useState('Food Security');
  const [newsCache, setNewsCache] = useState({});
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);

  const categoryMapping = {
    'Food Security': 'food_security',
    'Biodiversity': 'biodiversity', 
    'Climate Change': 'climate_change',
  };

  const categorySources = {
    'Food Security': 'EFSA',
    'Biodiversity': 'European Commission: Environment',
    'Climate Change': 'European Commission: Environment',
  };

  const fetchNewsIfNeeded = async (category) => {
    const oneHour = 60 * 60 * 1000;
    const now = Date.now();
    const cached = newsCache[category];

    if (cached && now - cached.timestamp < oneHour) {
      console.log('Using cached data for', category);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      // Map display category to API category
      const apiCategory = categoryMapping[category];
      if (!apiCategory) {
        console.error('Unknown category:', category);
        setLoading(false);
        return;
      }

      // Fetch from your RSS API
      const response = await fetch(`${RSS_API_BASE_URL}/${apiCategory}?limit=10&full_text=true`, {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('RSS API Response:', data);

      if (data && data.articles && data.articles.results) {
        setNewsCache((prev) => ({
          ...prev,
          [category]: {
            articles: data.articles.results,
            timestamp: now,
            full_text_extraction_enabled: data.full_text_extraction_enabled,
          },
        }));
        console.log(`Loaded ${data.articles.results.length} articles for ${category}`);
      } else {
        console.error('Error fetching news: No results returned', data);
      }
    } catch (error) {
      console.error('Network error fetching RSS news:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNewsIfNeeded(activeTab);
  }, [activeTab]);

  const openModal = (article) => {
    setSelectedArticle(article);
    setModalVisible(true);
  };

  const closeModal = () => {
    setSelectedArticle(null);
    setModalVisible(false);
  };

  const renderNewsItem = ({ item }) => (
    <TouchableOpacity
      style={styles.newsItem}
      onPress={() => openModal(item)}
    >
      <Image
        source={{ uri: item.image || 'https://via.placeholder.com/80' }}
        style={styles.newsImage}
      />
      <View style={styles.newsContent}>
        <Text style={styles.newsTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.newsMeta}>
          {new Date(item.date).toLocaleDateString()} • {categorySources[activeTab] || 'Unknown Source'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {Object.keys(categoryMapping).map((tab) => (
          <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)}>
            <Text style={[styles.tab, activeTab === tab && styles.activeTab]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* News List */}
      {loading ? (
        <ActivityIndicator size="large" color="#1E4E75" style={styles.loader} />
      ) : (
        <FlatList
          data={newsCache[activeTab]?.articles || []}
          renderItem={renderNewsItem}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.newsList}
          ListEmptyComponent={<Text style={styles.noNews}>No articles found.</Text>}
        />
      )}

      {/* Modal for Article Content */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView>
              <Text style={styles.modalTitle}>{selectedArticle?.title}</Text>
              <Text style={styles.modalMeta}>
                {new Date(selectedArticle?.date).toLocaleDateString()} •{' '}
                {categorySources[activeTab] || 'Unknown Source'}
              </Text>
              <Image
                source={{
                  uri: selectedArticle?.image || 'https://via.placeholder.com/300',
                }}
                style={styles.modalImage}
              />
              <Text style={styles.modalDescription}>
                {selectedArticle?.body || 'No content available for this article.'}
              </Text>
              {/* Removed full text extraction indicator */}
              {selectedArticle?.author && (
                <Text style={styles.authorText}>
                  By: {selectedArticle.author}
                </Text>
              )}
            </ScrollView>
            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  tab: {
    fontSize: 16,
    color: '#aaa',
    fontWeight: 'bold',
  },
  activeTab: {
    color: '#000',
    borderBottomWidth: 2,
    borderBottomColor: '#000',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
  },
  newsList: {
    padding: 10,
  },
  newsItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginBottom: 10,
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 2,
  },
  newsImage: {
    width: 80,
    height: 80,
    backgroundColor: '#ddd',
  },
  newsContent: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
  },
  newsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 5,
  },
  newsMeta: {
    fontSize: 12,
    color: '#666',
  },
  noNews: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 20,
    color: '#666',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalMeta: {
    fontSize: 12,
    color: '#666',
    marginBottom: 10,
  },
  modalImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    borderRadius: 8,
    marginBottom: 10,
  },
  modalDescription: {
    fontSize: 14,
    color: '#333',
    marginBottom: 10,
    lineHeight: 20,
  },
  imageCaption: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 10,
    paddingTop: 5,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  fullTextIndicator: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  authorText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 10,
    fontStyle: 'italic',
  },
  closeButton: {
    alignSelf: 'flex-end',
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#1E4E75',
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default NewsScreen;
