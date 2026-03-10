import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import theme from '../lib/theme';
import FormSection from '../components/FormSection';
import LabeledInput from '../components/LabeledInput';
import TagSelector from '../components/TagSelector';
import { MaterialIcons, Ionicons, AntDesign } from '@expo/vector-icons';
import SegmentedTabs from '../components/SegmentedTabs';
import { useNavigation } from '@react-navigation/native';
import Dropdown from '../components/Dropdown';
import { INQUIRY_SUBJECT_OPTIONS } from '../lib/constants';
import AppHeader from '../components/AppHeader';
import HamburgerMenu from '../components/HamburgerMenu';

export default function ScoreInputScreen() {
  const navigation = useNavigation<any>();
  const [menuOpen, setMenuOpen] = useState(false);
  const [koreanRaw, setKoreanRaw] = useState<string>('');
  const [koreanStd, setKoreanStd] = useState<string>('');
  const [koreanType, setKoreanType] = useState<'언매' | '화작' | undefined>();

  const [mathType, setMathType] = useState<'확통' | '미적' | '기하' | undefined>();
  const [mathRaw, setMathRaw] = useState<string>('');
  const [mathStd, setMathStd] = useState<string>('');

  const [english, setEnglish] = useState<string>('');
  const [history, setHistory] = useState<string>('');

  const [sci1, setSci1] = useState<string>('');
  const [sci1Type, setSci1Type] = useState<string | undefined>();
  // removed: 별도 표준 점수 입력은 사용하지 않음 (원점수 화면에서는 단일 점수만 입력)

  const [sci2, setSci2] = useState<string>('');
  const [sci2Type, setSci2Type] = useState<string | undefined>();
  // removed: 별도 표준 점수 입력은 사용하지 않음 (원점수 화면에서는 단일 점수만 입력)

  const [secondLang, setSecondLang] = useState<Record<string, string>>({});

  const handleReset = () => {
    setKoreanRaw('');
    setKoreanStd('');
    setMathType(undefined);
    setMathRaw('');
    setMathStd('');
    setEnglish('');
    setHistory('');
    setSci1('');
    setSci1Type(undefined);
    setSci2('');
    setSci2Type(undefined);
    setSecondLang({});
  };

  const handleSave = () => {
    console.log('점수 저장 시도', {
      koreanRaw,
      koreanStd,
      mathType,
      mathRaw,
      mathStd,
      english,
      history,
      sci1,
      sci1Type,
      sci2,
      sci2Type,
      secondLang,
    });
    // TODO: 실제 저장 로직(서버/로컬 저장) 연결 가능
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <AppHeader title="점수 입력" onPressMenu={() => setMenuOpen(true)} />
      <HamburgerMenu
        visible={menuOpen}
        onClose={() => setMenuOpen(false)}
        onNavigateScoreInput={() => navigation.navigate('ScoreInput')}
        onNavigateStrategy={() => navigation.navigate('Strategy')}
        onNavigateCollegeSelect={() => navigation.navigate('CollegeSelect')}
        onNavigateSupportStatus={() => navigation.navigate('SupportStatus')}
        onNavigateSupportStrategy={() => navigation.navigate('SupportStrategy')}
      />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <SegmentedTabs
          tabs={[
            { key: 'raw', label: '원점수 입력' },
            { key: 'std', label: '표준점수 입력' },
          ]}
          activeKey={'raw'}
          onChange={(key) => {
            if (key === 'std') {
              navigation.navigate('StandardScoreInput');
            }
          }}
          style={{ marginBottom: theme.spacing.md }}
        />

        <FormSection
          title="국어"
          icon={<MaterialIcons name="menu-book" size={20} color={theme.colors.primary} />}
        >
          <TagSelector
            options={[
              { key: '언매', label: '언매' },
              { key: '화작', label: '화작' },
            ]}
            value={koreanType}
            onChange={(key) => setKoreanType(key as '언매' | '화작')}
          />
          <LabeledInput
            label="공통"
            keyboardType="numeric"
            placeholder="0"
            hint="범위: 0 ~ 100"
            value={koreanRaw}
            onChangeText={setKoreanRaw}
          />
          <LabeledInput
            label="선택"
            keyboardType="numeric"
            placeholder="0"
            hint="범위: 0 ~ 200"
            value={koreanStd}
            onChangeText={setKoreanStd}
          />
        </FormSection>

        <FormSection
          title="수학"
          icon={<AntDesign name="calculator" size={20} color={theme.colors.primary} />}
          style={{ marginTop: theme.spacing.md }}
        >
          <TagSelector
            options={[
              { key: '확통', label: '확통' },
              { key: '미적', label: '미적' },
              { key: '기하', label: '기하' },
            ]}
            value={mathType}
            onChange={(key) => setMathType(key as '확통' | '미적' | '기하')}
          />
          <LabeledInput
            label="공통"
            keyboardType="numeric"
            placeholder="0"
            hint="범위: 0 ~ 100"
            value={mathRaw}
            onChangeText={setMathRaw}
          />
          <LabeledInput
            label="선택"
            keyboardType="numeric"
            placeholder="0"
            hint="범위: 0 ~ 200"
            value={mathStd}
            onChangeText={setMathStd}
          />
        </FormSection>

        <FormSection
          title="영어"
          icon={<Ionicons name="language-outline" size={20} color={theme.colors.primary} />}
          style={{ marginTop: theme.spacing.md }}
        >
          <LabeledInput
            label="점수"
            keyboardType="numeric"
            placeholder="0"
            hint="범위: 0 ~ 100"
            value={english}
            onChangeText={setEnglish}
          />
        </FormSection>

        <FormSection
          title="한국사"
          icon={<MaterialIcons name="history-edu" size={20} color={theme.colors.primary} />}
          style={{ marginTop: theme.spacing.md }}
        >
          <LabeledInput
            label="점수"
            keyboardType="numeric"
            placeholder="0"
            hint="범위: 0 ~ 100"
            value={history}
            onChangeText={setHistory}
          />
        </FormSection>

        <FormSection
          title="탐구 1"
          icon={<Ionicons name="flask-outline" size={20} color={theme.colors.primary} />}
          style={{ marginTop: theme.spacing.md }}
        >
          <Dropdown
            label="선택과목"
            options={INQUIRY_SUBJECT_OPTIONS}
            value={sci1Type}
            onChange={setSci1Type}
          />
          <LabeledInput
            label="점수"
            keyboardType="numeric"
            placeholder="0"
            hint="범위: 0 ~ 100"
            value={sci1}
            onChangeText={setSci1}
          />
        </FormSection>

        <FormSection
          title="탐구 2"
          icon={<Ionicons name="flask" size={20} color={theme.colors.primary} />}
          style={{ marginTop: theme.spacing.md }}
        >
          <Dropdown
            label="선택과목"
            options={INQUIRY_SUBJECT_OPTIONS}
            value={sci2Type}
            onChange={setSci2Type}
          />
          <LabeledInput
            label="점수"
            keyboardType="numeric"
            placeholder="0"
            hint="범위: 0 ~ 100"
            value={sci2}
            onChangeText={setSci2}
          />
        </FormSection>

        <FormSection
          title="제2외국어"
          icon={<Ionicons name="globe-outline" size={20} color={theme.colors.primary} />}
          style={{ marginTop: theme.spacing.md, marginBottom: theme.spacing.xl }}
        >
          <View style={{ gap: theme.spacing.sm }}>
            <View style={styles.secondLangGrid}>
              {['독일어', '프랑스어', '스페인어', '중국어', '일본어', '러시아어', '아랍어', '베트남어'].map((lang) => (
                <LabeledInput
                  key={lang}
                  label={lang}
                  keyboardType="numeric"
                  placeholder="등급"
                  containerStyle={{ width: '48%' }}
                  value={secondLang[lang] ?? ''}
                  onChangeText={(v) => setSecondLang((prev) => ({ ...prev, [lang]: v }))}
                />
              ))}
            </View>
          </View>
        </FormSection>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={[styles.footerBtn, styles.secondary]} onPress={handleReset}>
          <Text style={[styles.footerText, { color: theme.colors.text }]}>초기화</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.footerBtn, styles.primary]} onPress={handleSave}>
          <Text style={[styles.footerText, { color: theme.colors.onPrimary }]}>저장</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
    paddingTop: theme.spacing.md,
    gap: theme.spacing.md,
  },
  secondLangGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.outline,
  },
  footerBtn: {
    flex: 1,
    height: 48,
    borderRadius: theme.radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  primary: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  secondary: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.outline,
  },
  footerText: {
    fontSize: theme.typography.heading,
    fontWeight: '700',
  },
});