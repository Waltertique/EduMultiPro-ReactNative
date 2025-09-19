import { View, Text, StyleSheet } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

export default function Footer() {
  return (
    <View style={styles.pie}>
      <View style={styles.fila}>
        <View style={styles.col}>
          <Text style={styles.title}>Contactos:</Text>
        </View>
        <View style={styles.col}>
            <View style={styles.col2}>
                <FontAwesome name="phone" size={20} color="aqua" />
                <Text style={styles.text}> +546-160000</Text>
            </View>
            <View style={styles.col2}>
                <FontAwesome5 name="facebook" size={20} color="aqua" />
                <Text style={styles.text}> EduMultipro_08</Text>
            </View>
        </View>
        <View style={styles.col}>
            <View style={styles.col2}>
                <FontAwesome5 name="instagram" size={20} color="aqua" />
                <Text style={styles.text}> EduMultipro_08</Text>
            </View>
            <View style={styles.col2}>
                <FontAwesome name="globe" size={20} color="aqua" />
                <Text style={styles.text}> EduMultiPro</Text>
            </View>
        </View>
        <View style={styles.col}>
            <View style={styles.col2}>
                <FontAwesome name="envelope" size={20} color="aqua" />
                <Text style={styles.text}> Edu_Pro@gmail.com</Text>
            </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  pie: {
    backgroundColor: 'background: rgb(66, 66, 66);',
    paddingTop: 10,
    paddingBottom: 35,
    width: '100%',
  },
  fila: {
    flexDirection: 'column', // en móvil es mejor columna en vez de fila
    alignItems: 'center',
  },
  col: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
    width: '100%',
    justifyContent: 'space-around',
  },
  col2: {
    flexDirection: 'row',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 24,
    color: 'white', 
    marginBottom: 10,
  },
  text: {
    marginLeft: 8,
    fontSize: 16,
    color: 'white', 
  },
});