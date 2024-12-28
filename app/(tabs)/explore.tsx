import React, { useState } from 'react';
import { StyleSheet, View, TextInput, FlatList } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Button, Card, Divider } from 'react-native-paper';

const ExploreScreen = () => {
    const [searchText, setSearchText] = useState('');
    const [data, setData] = useState([
        { id: '1', title: 'Gunung Rinjani, Indonesia', description: 'Jelajahi keindahan Gunung Rinjani, salah satu gunung berapi tertinggi di Indonesia dengan pemandangan yang menakjubkan.' },
        { id: '2', title: 'Pulau Komodo, Indonesia', description: 'Temui komodo yang legendaris dan nikmati pemandangan alam yang eksotis di Pulau Komodo.' },
        { id: '3', title: 'Candi Borobudur, Indonesia', description: 'Kunjungi Candi Borobudur, candi Buddha terbesar di dunia yang penuh dengan nilai sejarah dan budaya.' },
        { id: '4', title: 'Raja Ampat, Indonesia', description: 'Selami surga bawah laut di Raja Ampat, dengan terumbu karang dan keanekaragaman hayati yang luar biasa.' },
        { id: '5', title: 'Danau Toba, Indonesia', description: 'Nikmati keindahan Danau Toba, danau vulkanik terbesar di dunia dengan suasana yang tenang.' },
        { id: '6', title: 'Bali, Indonesia', description: 'Rasakan keindahan pantai, budaya, dan keramahan di Pulau Dewata, Bali.' },
        { id: '7', title: 'Yogyakarta, Indonesia', description: 'Jelajahi kota budaya Yogyakarta, rumah bagi Keraton dan Candi Prambanan yang megah.' },
        { id: '8', title: 'Kawah Ijen, Indonesia', description: 'Saksikan fenomena api biru yang langka dan pemandangan kawah belerang di Kawah Ijen.' },
        { id: '9', title: 'Labuan Bajo, Indonesia', description: 'Gerbang menuju keajaiban alam Pulau Komodo dan tempat matahari terbenam yang menakjubkan.' },
        { id: '10', title: 'Tana Toraja, Indonesia', description: 'Pelajari tradisi unik dan pemandangan pegunungan yang indah di Tana Toraja.' },
    ]);
    
    const [filteredData, setFilteredData] = useState(data);

    const handleSearch = () => {
        const filtered = data.filter(item =>
            item.title.toLowerCase().includes(searchText.toLowerCase())
        );
        setFilteredData(filtered);
    };

    return (
        <ThemedView style={styles.container}>
            <View style={styles.header}>
                <ThemedText style={styles.welcomeText}>Welcome to Explore!</ThemedText>
                <ThemedText style={styles.subText}>Discover new destinations and experiences</ThemedText>
            </View>
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search destinations..."
                    value={searchText}
                    onChangeText={setSearchText}
                />
                <Button mode="contained" onPress={handleSearch} style={styles.searchButton}>
                    Search
                </Button>
            </View>
            <FlatList
                data={filteredData}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <Card style={styles.card}>
                        <Card.Title title={item.title} />
                        <Divider />
                        <Card.Content>
                            <ThemedText style={styles.descriptionText}>{item.description}</ThemedText>
                        </Card.Content>
                    </Card>
                )}
                ListEmptyComponent={
                    <ThemedText style={styles.emptyText}>No destinations found</ThemedText>
                }
            />
        </ThemedView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#ffe4e6', 
    },
    header: {
        marginBottom: 20,
        alignItems: 'center',
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#d6336c', 
    },
    subText: {
        fontSize: 16,
        color: '#9c1c4b', 
        marginTop: 8,
    },
    searchContainer: {
        flexDirection: 'row',
        marginBottom: 16,
        alignItems: 'center',
    },
    searchInput: {
        flex: 1,
        borderColor: '#f9bac4', 
        borderWidth: 1,
        borderRadius: 8,
        padding: 10,
        backgroundColor: '#fff',
        marginRight: 8,
    },
    searchButton: {
        backgroundColor: '#ff7f9c', 
    },
    card: {
        marginBottom: 16,
        borderRadius: 16, 
        backgroundColor: '#ffffff', 
        borderColor: '#f9bac4', 
        borderWidth: 1,
        padding: 16, 
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: 2 }, 
        shadowOpacity: 0.1, 
        shadowRadius: 8, 
        elevation: 5, 
    },
    emptyText: {
        marginTop: 20,
        textAlign: 'center',
        fontSize: 16,
        color: '#9c1c4b', 
    },
    descriptionText: {
        color: '#6b0d31', 
        fontSize: 14, 
        marginTop: 8, 
    },
});

export default ExploreScreen;
