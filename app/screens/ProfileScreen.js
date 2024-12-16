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

const API_KEY = 'ac4bb526-a322-47da-8220-89ea340fe698'; 
const BASE_URL = 'https://eventregistry.org/api/v1/article/getArticles';

const NewsScreen = () => {
  const [activeTab, setActiveTab] = useState('Food Security');
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);

  const categoryKeywords = {
    'Food Security': 'food security OR agriculture',
    Biodiversity: 'biodiversity OR ecosystem',
    'Climate Change': 'climate change OR global warming',
  };

  const fetchNews = async () => {
    setLoading(true);
    try {
      const requestBody = {
        action: 'getArticles',
        keyword: categoryKeywords[activeTab],
        articlesPage: 1,
        articlesCount: 10,
        articlesSortBy: 'date',
        articlesSortByAsc: false,
        dataType: ['news'],
        forceMaxDataTimeWindow: 31,
        resultType: 'articles',
        apiKey: API_KEY,
      };

      const response = await fetch(BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      if (data && data.articles && data.articles.results) {
        setNewsData(data.articles.results);
      } else {
        console.error('Error fetching news: No results returned');
      }
    } catch (error) {
      console.error('Network error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
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
          {new Date(item.date).toLocaleDateString()} • {item.source?.title || 'Unknown Source'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {Object.keys(categoryKeywords).map((tab) => (
          <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)}>
            <Text style={[styles.tab, activeTab === tab && styles.activeTab]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* News List */}
      {loading ? (
        <ActivityIndicator size="large" color="#1E4E75" style={styles.loader} />
      ) : (
        <FlatList
          data={newsData}
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
                {selectedArticle?.source?.title || 'Unknown Source'}
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
