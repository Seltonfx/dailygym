import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

import { useAppData } from "../context/AppDataContext";
import { useAuth } from "../context/AuthContext";

import AchievementsScreen from "../screens/AchievementsScreen";
import LoginScreen from "../screens/auth/LoginScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";
import CreateWorkoutScreen from "../screens/CreateWorkoutScreen";
import HistoryScreen from "../screens/HistoryScreen";
import HomeScreen from "../screens/HomeScreen";
import ProfileEditScreen from "../screens/ProfileEditScreen";
import ProfileScreen from "../screens/ProfileScreen";
import StatsScreen from "../screens/StatsScreen";
import WorkoutDetailScreen from "../screens/WorkoutDetailScreen";
import WorkoutsScreen from "../screens/WorkoutsScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function LoadingScreen() {
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#0f172a",
      }}
    >
      <ActivityIndicator size="large" color="#22c55e" />
    </View>
  );
}

function HomeWrapper({ navigation }) {
  const app = useAppData();

  return (
    <HomeScreen
      onGoToWorkouts={() => navigation.navigate("TreinosTab")}
      onGoToHistory={() => navigation.navigate("HistoricoTab")}
      onGoToProfile={() => navigation.navigate("PerfilTab")}
      onGoToStats={() => navigation.navigate("EstatisticasTab")}
      onGoToAchievements={() => navigation.navigate("Achievements")}
      onContinueWorkout={() =>
        app.treinoEmAndamento?.treino?.id &&
        navigation.navigate("WorkoutDetail", {
          workoutId: app.treinoEmAndamento.treino.id,
        })
      }
      onEnableReminder={app.enableReminder}
      onDisableReminder={app.disableReminder}
      lembreteAtivo={app.lembreteAtivo}
      totalTreinos={app.totalTreinos}
      totalConcluidos={app.totalConcluidos}
      ultimoTreino={app.ultimoTreino}
      totalSeriesConcluidas={app.totalSeriesConcluidas}
      treinoSemana={app.treinoSemana}
      totalDiasTreinadosSemana={app.totalDiasTreinadosSemana}
      perfil={app.perfil}
      metaSemanalNumero={app.metaSemanalNumero}
      percentualMeta={app.percentualMeta}
      treinoEmAndamento={app.treinoEmAndamento}
      streak={app.streak}
    />
  );
}

function WorkoutsWrapper({ navigation }) {
  const app = useAppData();

  return (
    <WorkoutsScreen
      onGoBack={() => navigation.navigate("HomeTab")}
      onGoToCreateWorkout={() => navigation.navigate("CreateWorkout")}
      onOpenWorkout={(id) =>
        navigation.navigate("WorkoutDetail", { workoutId: id })
      }
      onDeleteWorkout={app.deleteWorkout}
      onEditWorkout={(id) =>
        navigation.navigate("EditWorkout", { workoutId: id })
      }
      treinos={app.treinos}
    />
  );
}

function HistoryWrapper({ navigation }) {
  const app = useAppData();

  return (
    <HistoryScreen
      historico={app.historico}
      onGoBack={() => navigation.navigate("HomeTab")}
    />
  );
}

function StatsWrapper({ navigation }) {
  const app = useAppData();

  return (
    <StatsScreen
      historico={app.historico}
      totalSeriesConcluidas={app.totalSeriesConcluidas}
      totalDiasTreinadosSemana={app.totalDiasTreinadosSemana}
      metaSemanalNumero={app.metaSemanalNumero}
      percentualMeta={app.percentualMeta}
      onGoBack={() => navigation.navigate("HomeTab")}
    />
  );
}

function ProfileWrapper({ navigation }) {
  const app = useAppData();
  const { logout } = useAuth();

  return (
    <View style={{ flex: 1 }}>
      <ProfileScreen
        perfil={app.perfil}
        onGoBack={() => navigation.navigate("HomeTab")}
        onEditProfile={() => navigation.navigate("EditProfile")}
      />

      <Pressable
        onPress={logout}
        style={{
          position: "absolute",
          right: 20,
          top: 56,
          backgroundColor: "#7f1d1d",
          borderRadius: 12,
          paddingHorizontal: 14,
          paddingVertical: 10,
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "800" }}>Sair</Text>
      </Pressable>
    </View>
  );
}

function CreateWorkoutWrapper({ navigation, route }) {
  const app = useAppData();
  const workoutId = route.params?.workoutId;
  const treinoParaEditar = workoutId
    ? app.treinos.find((item) => item.id === workoutId)
    : null;

  return (
    <CreateWorkoutScreen
      onGoBack={() => navigation.goBack()}
      onSaveWorkout={(payload) => {
        if (workoutId) {
          app.updateWorkout(payload);
        } else {
          app.addWorkout(payload);
        }
        navigation.goBack();
      }}
      treinoParaEditar={treinoParaEditar}
      modoEdicao={!!workoutId}
    />
  );
}

function WorkoutDetailWrapper({ navigation, route }) {
  const app = useAppData();
  const workoutId = route.params?.workoutId;
  const treino = app.treinos.find((item) => item.id === workoutId);

  return (
    <WorkoutDetailScreen
      treino={treino}
      onGoBack={() => navigation.goBack()}
      onFinishWorkout={(record) => {
        app.finishWorkout(record);
        navigation.navigate("MainTabs", { screen: "HistoricoTab" });
      }}
      onSaveProgress={app.saveWorkoutProgress}
      treinoEmAndamento={app.treinoEmAndamento}
      onUpdateExerciseLoad={app.updateExerciseLoad}
      evolucaoCarga={app.evolucaoCarga}
    />
  );
}

function EditProfileWrapper({ navigation }) {
  const app = useAppData();

  return (
    <ProfileEditScreen
      perfilAtual={app.perfil}
      onGoBack={() => navigation.goBack()}
      onSaveProfile={(profile) => {
        app.updateProfileData(profile);
        navigation.goBack();
      }}
    />
  );
}

function AchievementsWrapper({ navigation }) {
  const app = useAppData();

  return (
    <AchievementsScreen
      historico={app.historico}
      totalSeriesConcluidas={app.totalSeriesConcluidas}
      totalDiasTreinadosSemana={app.totalDiasTreinadosSemana}
      metaSemanalNumero={app.metaSemanalNumero}
      onGoBack={() => navigation.goBack()}
    />
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: "#111827", borderTopColor: "#334155" },
        tabBarActiveTintColor: "#22c55e",
        tabBarInactiveTintColor: "#94a3b8",
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeWrapper}
        options={{ title: "Home" }}
      />
      <Tab.Screen
        name="TreinosTab"
        component={WorkoutsWrapper}
        options={{ title: "Treinos" }}
      />
      <Tab.Screen
        name="HistoricoTab"
        component={HistoryWrapper}
        options={{ title: "Histórico" }}
      />
      <Tab.Screen
        name="EstatisticasTab"
        component={StatsWrapper}
        options={{ title: "Stats" }}
      />
      <Tab.Screen
        name="PerfilTab"
        component={ProfileWrapper}
        options={{ title: "Perfil" }}
      />
    </Tab.Navigator>
  );
}

function AppStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#111827" },
        headerTintColor: "#fff",
        contentStyle: { backgroundColor: "#0f172a" },
      }}
    >
      <Stack.Screen
        name="MainTabs"
        component={MainTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CreateWorkout"
        component={CreateWorkoutWrapper}
        options={{ title: "Criar treino" }}
      />
      <Stack.Screen
        name="EditWorkout"
        component={CreateWorkoutWrapper}
        options={{ title: "Editar treino" }}
      />
      <Stack.Screen
        name="WorkoutDetail"
        component={WorkoutDetailWrapper}
        options={{ title: "Treino" }}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileWrapper}
        options={{ title: "Editar perfil" }}
      />
      <Stack.Screen
        name="Achievements"
        component={AchievementsWrapper}
        options={{ title: "Conquistas" }}
      />
    </Stack.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#0f172a" },
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

export default function RootNavigator() {
  const { isAuthenticated, authLoading } = useAuth();
  const { dataLoading } = useAppData();

  if (authLoading || dataLoading) {
    return <LoadingScreen />;
  }

  return isAuthenticated ? <AppStack /> : <AuthStack />;
}
