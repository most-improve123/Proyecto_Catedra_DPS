import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  Alert, 
  Platform,
  Linking 
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

// Componente de Autenticación
const AuthScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const validateLogin = () => {
    const newErrors = {};
    if (!email) newErrors.email = 'El correo electrónico es requerido';
    if (!password) newErrors.password = 'La contraseña es requerida';
    if (email && !/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Correo electrónico inválido';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = () => {
    if (validateLogin()) {
      navigation.navigate('Cita');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.authContainer}>
      <Text style={styles.authTitle}>Inicio de Sesión</Text>

      <TextInput
        placeholder="Correo electrónico"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

      <TextInput
        placeholder="Contraseña"
        style={styles.input}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

      <TouchableOpacity style={styles.boton} onPress={handleLogin}>
        <Text style={styles.textoBoton}>Iniciar Sesión</Text>
      </TouchableOpacity>

      <View style={styles.authLinks}>
        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
          <Text style={styles.linkText}>Crear cuenta nueva</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Forgot')}>
          <Text style={styles.linkText}>¿Olvidaste tu contraseña?</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

// Componente de Registro
const SignupScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});

  const validateSignup = () => {
    const newErrors = {};
    if (!email) newErrors.email = 'El correo electrónico es requerido';
    if (!password) newErrors.password = 'La contraseña es requerida';
    if (password !== confirmPassword) newErrors.confirm = 'Las contraseñas no coinciden';
    if (password.length < 6) newErrors.password = 'Mínimo 6 caracteres';
    if (email && !/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Correo electrónico inválido';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = () => {
    if (validateSignup()) {
      const emailBody = `Por favor, verifique mi cuenta con este correo: ${email}`;
      const mailtoUrl = `mailto:soporte@example.com?subject=Verificación de Cuenta&body=${encodeURIComponent(emailBody)}`;

      Linking.openURL(mailtoUrl)
        .then(() => {
          Alert.alert(
            'Cuenta Creada', 
            'Revisa tu correo para completar la verificación',
            [{ text: 'OK', onPress: () => navigation.goBack() }]
          );
        })
        .catch(() => {
          Alert.alert('Error', 'No se pudo abrir el cliente de correo');
        });
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.authContainer}>
      <Text style={styles.authTitle}>Crear Cuenta</Text>

      <TextInput
        placeholder="Correo electrónico"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

      <TextInput
        placeholder="Contraseña"
        style={styles.input}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

      <TextInput
        placeholder="Confirmar Contraseña"
        style={styles.input}
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      {errors.confirm && <Text style={styles.errorText}>{errors.confirm}</Text>}

      <TouchableOpacity style={styles.boton} onPress={handleSignup}>
        <Text style={styles.textoBoton}>Registrarse</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.linkText}>¿Ya tienes cuenta? Inicia Sesión</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

// Componente de Recuperación de Contraseña
const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const validateEmail = () => {
    const newErrors = {};
    if (!email) newErrors.email = 'El correo electrónico es requerido';
    if (email && !/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Correo electrónico inválido';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleReset = () => {
    if (validateEmail()) {
      const mailtoUrl = `mailto:soporte@example.com?subject=Recuperación de Contraseña&body=Por favor, envíeme instrucciones para restablecer mi contraseña. Mi correo es: ${email}`;
      
      Linking.canOpenURL(mailtoUrl)
        .then(supported => {
          if (!supported) {
            return Alert.alert('Error', 'Instala un cliente de correo electrónico');
          }
          return Linking.openURL(mailtoUrl);
        })
        .then(() => {
          setSuccess(true);
          setTimeout(() => navigation.goBack(), 5000);
        })
        .catch(error => {
          Alert.alert('Error', 'No se pudo abrir el cliente de correo');
        });
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.authContainer}>
      <Text style={styles.authTitle}>Recuperar Contraseña</Text>

      {success ? (
        <Text style={styles.successText}>
          Por favor, completa el envío del correo desde tu cliente de email.
          Serás redirigido en 5 segundos.
        </Text>
      ) : (
        <>
          <TextInput
            placeholder="Correo electrónico"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

          <TouchableOpacity style={styles.boton} onPress={handleReset}>
            <Text style={styles.textoBoton}>Enviar Instrucciones</Text>
          </TouchableOpacity>
        </>
      )}

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.linkText}>Volver al Inicio de Sesión</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

// Componente DatePicker
const DatePicker = ({ selectedDate, onDateChange }) => {
  const [isVisible, setIsVisible] = useState(false);

  if (Platform.OS === 'web') {
    return (
      <input
        type="date"
        style={styles.webDateInput}
        value={selectedDate}
        onChange={(e) => onDateChange(e.target.value)}
        min={new Date().toISOString().split('T')[0]}
      />
    );
  }

  const DateTimePickerModal = require('react-native-modal-datetime-picker').default;

  return (
    <>
      <TouchableOpacity 
        style={[styles.dateButton, selectedDate && styles.dateSelected]}
        onPress={() => setIsVisible(true)}
      >
        <Text style={styles.buttonText}>
          {selectedDate || '📅 Seleccionar fecha'}
        </Text>
      </TouchableOpacity>

      <DateTimePickerModal
        isVisible={isVisible}
        mode="date"
        onConfirm={(date) => {
          onDateChange(date.toISOString().split('T')[0]);
          setIsVisible(false);
        }}
        onCancel={() => setIsVisible(false)}
        minimumDate={new Date()}
        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
      />
    </>
  );
};

// Componente de Citas
const CitaScreen = ({ navigation }) => {
  const [nombre, setNombre] = useState('');
  const [dui, setDui] = useState('');
  const [telefono, setTelefono] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [error, setError] = useState('');

  const reservas = [
    '2025-03-31 10:30',
    '2025-03-31 11:00',
    '2025-03-31 15:00'
  ];

  const validarHora = (time) => {
    const horaCompleta = `${selectedDate} ${time}`;
    
    if (reservas.includes(horaCompleta)) {
      setError('¡Horario reservado! Seleccione otra hora');
      setSelectedTime('');
    } else {
      setError('');
      setSelectedTime(time);
    }
  };

  const handleReservar = () => {
    const validaciones = [
      [!nombre, 'El nombre completo es requerido'],
      [!dui, 'El DUI es obligatorio'],
      [!telefono, 'El teléfono es necesario'],
      [!selectedDate, 'Debe seleccionar una fecha'],
      [!selectedTime, 'Seleccione un horario disponible'],
      [!/^\d{8}-\d$/.test(dui), 'Formato DUI inválido (Ejemplo: 00000000-0)'],
      [!/^\d{4}-\d{4}$/.test(telefono), 'Formato teléfono inválido (Ejemplo: 7777-7777)'],
      [reservas.includes(`${selectedDate} ${selectedTime}`), 'Este horario ya está ocupado']
    ];

    for (const [condicion, mensaje] of validaciones) {
      if (condicion) {
        Alert.alert('Error', mensaje);
        return;
      }
    }

    Alert.alert(
      '✅ Cita Confirmada',
      `Revisa tu correo electrónico para enviar la confirmación`,
      [{
        text: 'Aceptar',
        onPress: () => {
          // Reset campos
          setNombre('');
          setDui('');
          setTelefono('');
          setSelectedDate('');
          setSelectedTime('');
          setError('');
          
          // Abrir cliente de correo
          const emailBody = `Confirmación de cita:\n
            Nombre: ${nombre}\n
            DUI: ${dui}\n
            Teléfono: ${telefono}\n
            Fecha: ${selectedDate}\n
            Hora: ${selectedTime}`;

          const mailtoUrl = `mailto:citas@example.com?subject=Confirmación de Cita&body=${encodeURIComponent(emailBody)}`;

          Linking.openURL(mailtoUrl)
            .catch(() => Alert.alert('Error', 'Error al abrir el correo'));
        }
      }]
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>Haz tu cita en línea</Text>

      <TextInput
        placeholder="Nombre completo"
        style={styles.input}
        value={nombre}
        onChangeText={setNombre}
        autoCapitalize="words"
      />

      <TextInput
        placeholder="DUI (00000000-0)"
        style={styles.input}
        value={dui}
        onChangeText={setDui}
        keyboardType="numeric"
        maxLength={10}
      />

      <TextInput
        placeholder="Teléfono (7777-7777)"
        style={styles.input}
        value={telefono}
        onChangeText={setTelefono}
        keyboardType="phone-pad"
        maxLength={9}
      />

      <DatePicker
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
      />

      {selectedDate && (
        <View style={styles.timeContainer}>
          <Text style={styles.subtitulo}>Horarios disponibles:</Text>
          
          <View style={styles.timeGrid}>
            {['09:00', '10:00', '10:30', '11:00', '14:00', '15:00', '16:00'].map((time) => (
              <TouchableOpacity
                key={time}
                style={[
                  styles.timeButton,
                  selectedTime === time && styles.selectedTime,
                  reservas.includes(`${selectedDate} ${time}`) && styles.disabledTime
                ]}
                onPress={() => validarHora(time)}
                disabled={reservas.includes(`${selectedDate} ${time}`)}
              >
                <Text style={[
                  styles.timeText,
                  reservas.includes(`${selectedDate} ${time}`) && styles.disabledText
                ]}>
                  {time}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </View>
      )}

      <TouchableOpacity 
        style={styles.boton}
        onPress={handleReservar}
      >
        <Text style={styles.textoBoton}>🗓️ Confirmar Cita</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.boton, { backgroundColor: '#E74C3C', marginTop: 15 }]}
        onPress={() => navigation.navigate('Auth')}
      >
        <Text style={styles.textoBoton}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

// Navegación Principal
const AppNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator initialRouteName="Auth" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Auth" component={AuthScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="Forgot" component={ForgotPasswordScreen} />
      <Stack.Screen name="Cita" component={CitaScreen} />
    </Stack.Navigator>
  </NavigationContainer>
);

// Estilos (se mantienen igual que en tu código original)
const styles = StyleSheet.create({
  authContainer: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  authTitle: {
    fontSize: 28,
    color: '#3970B0',
    marginBottom: 30,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  titulo: {
    fontSize: 24,
    color: '#3970B0',
    marginBottom: 25,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#4C8BD6',
    borderWidth: 2,
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#F8F9FA',
  },
  dateButton: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    borderWidth: 2,
    borderColor: '#4C8BD6',
    alignItems: 'center',
  },
  webDateInput: {
    width: '100%',
    height: 50,
    border: '2px solid #4C8BD6',
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#F8F9FA',
  },
  timeContainer: {
    marginVertical: 20,
  },
  subtitulo: {
    fontSize: 18,
    color: '#2C3E50',
    marginBottom: 15,
    fontWeight: '600',
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
  },
  timeButton: {
    backgroundColor: '#4C8BD6',
    padding: 15,
    borderRadius: 10,
    width: '45%',
    alignItems: 'center',
  },
  selectedTime: {
    backgroundColor: '#3970B0',
    transform: [{ scale: 1.05 }],
  },
  disabledTime: {
    backgroundColor: '#BEC3C9',
    opacity: 0.6,
  },
  timeText: {
    color: '#FFFFFF',
    fontWeight: '500',
    fontSize: 16,
  },
  disabledText: {
    color: '#666666',
    textDecorationLine: 'line-through',
  },
  errorText: {
    color: '#E74C3C',
    marginTop: 15,
    textAlign: 'center',
    fontWeight: '500',
    fontSize: 14,
  },
  boton: {
    backgroundColor: '#3970B0',
    padding: 18,
    borderRadius: 10,
    marginTop: 25,
    alignItems: 'center',
  },
  textoBoton: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 18,
  },
  authLinks: {
    marginTop: 20,
    alignItems: 'center',
    gap: 15,
  },
  linkText: {
    color: '#4C8BD6',
    textDecorationLine: 'underline',
  },
  successText: {
    color: '#2ECC71',
    textAlign: 'center',
    marginVertical: 20,
    fontSize: 16,
  },
});

export default AppNavigator;