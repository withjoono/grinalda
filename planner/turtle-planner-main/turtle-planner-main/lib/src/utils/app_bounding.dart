import 'package:get/get.dart';
import 'package:turtle_planner/src/controllers/auth/login_controller.dart';
import 'package:turtle_planner/src/controllers/auth/mail_verification_controller.dart';
import 'package:turtle_planner/src/controllers/auth/signup_controller.dart';
import 'package:turtle_planner/src/controllers/screens/calendar/long_term_view_controller.dart';
import 'package:turtle_planner/src/controllers/screens/settings/profile_controller.dart';
import 'package:turtle_planner/src/controllers/core/study_plan/study_plan_controller.dart';
import 'package:turtle_planner/src/controllers/core/user_controller.dart';
import 'package:turtle_planner/src/data/repositories/study_plan_repository.dart';
import 'package:turtle_planner/src/data/repositories/study_tag_repository.dart';
import 'package:turtle_planner/src/data/repositories/user_repository.dart';
import 'package:turtle_planner/src/utils/helper/network_manager.dart';
import '../data/repositories/authentication_repository.dart';

class InitialBinding extends Bindings {
  @override
  void dependencies() {
    // Repository
    Get.put(NetworkManager());
    Get.lazyPut(() => AuthenticationRepository(), fenix: true);
    Get.lazyPut(() => UserRepository(), fenix: true);
    Get.lazyPut(() => StudyPlanRepository(), fenix: true);
    Get.lazyPut(() => StudyTagRepository(), fenix: true);

    /// Auth
    Get.lazyPut(() => LoginController());
    Get.lazyPut(() => SignUpController());
    Get.lazyPut(() => MailVerificationController());

    /// Core
    Get.lazyPut(() => ProfileController());
    Get.lazyPut(() => LongTermViewController());
    Get.lazyPut(() => StudyPlanController(), fenix: true);
    Get.lazyPut(() => UserController(), fenix: true);
  }
}
