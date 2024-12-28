import React, { useEffect, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, StyleSheet, Animated, View } from 'react-native';
import {
    ActivityIndicator,
    Button,
    Card,
    Dialog,
    FAB,
    Portal,
    Provider as PaperProvider,
    Text,
    TextInput
} from 'react-native-paper';
import { useRouter } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useTodos } from '@/context/TodoContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import API_URL from '@/config/config';
import Constants from "expo-constants";
import { LinearGradient } from 'expo-linear-gradient';

const TodosScreen = () => {
    const { todos, fetchTodos } = useTodos();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    const [loading, setLoading] = useState(true);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');
    const [gradientAnimation, setGradientAnimation] = useState(new Animated.Value(0));
    const router = useRouter();

    useEffect(() => {
        const loadTodos = async () => {
            setLoading(true);
            await fetchTodos();
            setLoading(false);
        };
        loadTodos();

       
        const gradientColors = [
            ['#B1F0F7', '#B4DA1A9', '#0A5EB0'],
            ['#3D3BF3', '#4335A7', '#FFD700'],
            ['#1F509A', '#FF8C00', '#B1F0F7']
        ];

        let index = 0;
        const interval = setInterval(() => {
            index = (index + 1) % gradientColors.length;
            setGradientAnimation(new Animated.Value(0));

          
            Animated.timing(gradientAnimation, {
                toValue: 1,
                duration: 3000, 
                useNativeDriver: false,
            }).start();

            
            gradientAnimation.setValue(0); 
        }, 3000); 
        return () => clearInterval(interval); 
    }, []);

    const handleAddTodo = async () => {
        if (!title || !description) {
            setDialogMessage('Both title and description are required.');
            setDialogVisible(true);
            return;
        }
        try {
            const token = await AsyncStorage.getItem('token');
            await axios.post(`${API_URL}/api/todos`, {
                title,
                description
            }, { headers: { Authorization: `Bearer ${token}` } });
            fetchTodos();
            setTitle('');
            setDescription('');
            setIsAdding(false);
        } catch (error) {
            setDialogMessage('Failed to add todo');
            setDialogVisible(true);
        }
    };

    const handleDeleteTodo = async (id: string) => {
        try {
            const token = await AsyncStorage.getItem('token');
            await axios.delete(`${API_URL}/api/todos/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            fetchTodos();
        } catch (error) {
            setDialogMessage('Failed to delete todo');
            setDialogVisible(true);
        }
    };

    return (
        <PaperProvider>
            {}
            <View style={styles.container}>
            <LinearGradient
    colors={['#E6E6FA', '#ADD8E6', '#98FF98']} // Lavender, Light Blue, Mint Green
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={[styles.background, {
        transform: [
            {
                translateX: gradientAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 200],
                }),
            },
        ],
    }]}
/>
                
                {/* Content */}
                <ThemedView style={styles.innerContainer}>
                    <ThemedText style={styles.title} type="title">ToDo List</ThemedText>
                    {loading ? (
                        <ActivityIndicator style={styles.loading} animating={true} />
                    ) : (
                        <FlatList
                            data={todos}
                            keyExtractor={(item) => item._id}
                            renderItem={({ item }) => (
                                <Card style={styles.card} elevation={5} onPress={() => router.push(`../todo/${item._id}`)}>
                                    <Card.Content>
                                        <Text variant="titleMedium" style={styles.cardTitle}>{item.title}</Text>
                                        <Text variant="bodyMedium" style={styles.description}>{item.description}</Text>
                                    </Card.Content>
                                    <Card.Actions>
                                        <Button onPress={() => handleDeleteTodo(item._id)} style={styles.deleteButton}>Delete</Button>
                                    </Card.Actions>
                                </Card>
                            )}
                            contentContainerStyle={styles.listContainer}
                        />
                    )}
                    {isAdding && (
                        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.inputContainer}>
                            <TextInput label="Title" value={title} onChangeText={setTitle} style={styles.input} mode="outlined" />
                            <TextInput label="Description" value={description} onChangeText={setDescription} style={styles.input} mode="outlined" multiline />
                            <Button mode="contained" onPress={handleAddTodo} style={styles.addButton}>Add Todo</Button>
                            <Button onPress={() => setIsAdding(false)} style={styles.cancelButton}>Cancel</Button>
                        </KeyboardAvoidingView>
                    )}
                    {!isAdding && (
                        <FAB style={styles.fab} icon="plus" onPress={() => setIsAdding(true)} label="Add Todo" />
                    )}
                    <Portal>
                        <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)} style={styles.dialog}>
                            <Dialog.Title>Alert</Dialog.Title>
                            <Dialog.Content>
                                <Text>{dialogMessage}</Text>
                            </Dialog.Content>
                            <Dialog.Actions>
                                <Button onPress={() => setDialogVisible(false)} style={styles.dialogButton}>OK</Button>
                            </Dialog.Actions>
                        </Dialog>
                    </Portal>
                </ThemedView>
            </View>
        </PaperProvider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        paddingHorizontal: 16,
        backgroundColor: '#ffe4e6', // Pink soft untuk latar belakang utama
    },
    background: {
        ...StyleSheet.absoluteFillObject,
        position: 'absolute',
        zIndex: -1,
        borderRadius: 10,
        backgroundColor: '#fff', // Putih untuk lapisan latar tambahan
    },
    innerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
        backgroundColor: '#ffe4e6', // Pink soft untuk latar dalam
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        marginTop: 20,
        color: '#d6336c', // Pink cerah untuk teks judul
        textAlign: 'center',
    },
    listContainer: {
        paddingVertical: 10,
    },
    card: {
        marginBottom: 16,
        borderRadius: 12, // Membuat sudut lebih bulat
        backgroundColor: '#fff', // Warna latar kartu putih
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 5,
        borderWidth: 1,
        borderColor: '#f9bac4', // Border pink lembut
        padding: 16, // Menambah ruang di dalam kartu
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#d6336c', // Pink cerah untuk judul kartu
        marginBottom: 8,
    },
    description: {
        color: '#333', // Abu gelap untuk deskripsi
        fontSize: 16,
        lineHeight: 24, // Menambahkan spasi antar baris
    },
    deleteButton: {
        backgroundColor: '#ff7f9c', // Tombol hapus dengan warna pink cerah
        borderRadius: 5,
        padding: 8,
    },
    fab: {
        position: 'absolute',
        right: 16,
        bottom: 16,
        backgroundColor: '#ff7f9c', // FAB dengan warna pink cerah
        elevation: 6,
    },
    inputContainer: {
        padding: 16,
        backgroundColor: '#ffe4e6', // Pink soft untuk kontainer input
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        elevation: 5,
    },
    input: {
        marginBottom: 12,
        backgroundColor: '#fff', // Putih untuk latar input
        borderWidth: 1,
        borderColor: '#f9bac4', // Border pink lembut untuk input
        borderRadius: 8,
        padding: 10,
    },
    addButton: {
        marginTop: 16,
        backgroundColor: '#ff7f9c', // Tombol tambah dengan warna pink cerah
        padding: 12,
        borderRadius: 8,
    },
    cancelButton: {
        marginTop: 8,
        backgroundColor: '#ff7f9c', // Tombol batal dengan pink soft
        padding: 12,
        borderRadius: 8,
    },
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    dialog: {
        backgroundColor: '#fff', // Dialog dengan latar putih
        borderRadius: 12,
        padding: 16,
    },
    dialogButton: {
        backgroundColor: '#ff7f9c', // Tombol dialog dengan warna pink cerah
        borderRadius: 5,
        padding: 8,
    },
});

export default TodosScreen;




