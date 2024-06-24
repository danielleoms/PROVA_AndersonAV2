import React, { useState, useEffect } from 'react';
import { View, Text, Button, TextInput, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GerenciadorSenhas = () => {
  const [senha, setSenha] = useState('');
  const [ultimaSenhaSalva, setUltimaSenhaSalva] = useState('');
  const [recuperandoSenha, setRecuperandoSenha] = useState(false);

  useEffect(() => {
    recuperarSenha();
  }, []);

  const gerarSenha = () => {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let novaSenha = '';
    for (let i = 0; i < 8; i++) {
      const indiceAleatorio = Math.floor(Math.random() * caracteres.length);
      novaSenha += caracteres[indiceAleatorio];
    }
    setSenha(novaSenha);
    salvarSenha(novaSenha);
  };

  const salvarSenha = async (novaSenha) => {
    try {
      await AsyncStorage.setItem('@meuApp:senha', novaSenha);
      setUltimaSenhaSalva(novaSenha);
      Alert.alert('Sucesso', 'Senha salva com sucesso!');
    } catch (erro) {
      console.error('Erro ao salvar a senha:', erro);
      Alert.alert('Erro', 'Não foi possível salvar a senha.');
    }
  };

  const recuperarSenha = async () => {
    try {
      setRecuperandoSenha(true);
      const senhaSalva = await AsyncStorage.getItem('@meuApp:senha');
      if (senhaSalva !== null) {
        setSenha(senhaSalva);
        setUltimaSenhaSalva(senhaSalva);
      } else {
        Alert.alert('Aviso', 'Nenhuma senha salva encontrada.');
      }
    } catch (erro) {
      console.error('Erro ao recuperar a senha:', erro);
      Alert.alert('Erro', 'Não foi possível recuperar a senha.');
    } finally {
      setRecuperandoSenha(false);
    }
  };

  const apagarSenha = async () => {
    try {
      await AsyncStorage.removeItem('@meuApp:senha');
      setSenha('');
      setUltimaSenhaSalva('');
      Alert.alert('Sucesso', 'Senha apagada com sucesso!');
    } catch (erro) {
      console.error('Erro ao apagar a senha:', erro);
      Alert.alert('Erro', 'Não foi possível apagar a senha.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Senha:</Text>
      <Text style={styles.senha}>{senha}</Text>

      <TextInput
        style={styles.input}
        value={recuperandoSenha ? 'Recuperando senha...' : ultimaSenhaSalva}
        placeholder="Última senha salva"
        editable={false}
      />

      <View style={styles.buttonsContainer}>
        <Button title="Gerar Nova Senha" onPress={gerarSenha} />
        <View style={styles.buttonSpacing} />
        <Button title="Recuperar Senha Salva" onPress={recuperarSenha} disabled={recuperandoSenha} />
        <View style={styles.buttonSpacing} />
        <Button title="Apagar Senha Salva" onPress={apagarSenha} color="red" />
      </View>

      {recuperandoSenha && <ActivityIndicator size="large" color="#0000ff" />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#f8f8f8',
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
    color: '#333',
  },
  senha: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000',
  },
  input: {
    width: '100%',
    height: 40,
    paddingHorizontal: 10,
    marginBottom: 20,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  buttonsContainer: {
    marginTop: 20,
    width: '100%',
  },
  buttonSpacing: {
    marginVertical: 10,
  },
});

export default GerenciadorSenhas;