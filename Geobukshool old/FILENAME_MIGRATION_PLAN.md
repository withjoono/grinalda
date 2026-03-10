# Filename Migration Plan

## Korean Filename → English Filename Mapping

### DetailModal Files
| Current | New | Description |
|---------|-----|-------------|
| K_상세보기_논술모달_내용.tsx | essay-detail-modal-content.tsx | Essay detail modal content |
| K_상세보기_전형정보탭.tsx | admission-info-tab.tsx | Admission info tab |
| K_상세보기_논술정보탭.tsx | essay-info-tab.tsx | Essay info tab |
| K_상세보기_교과예측탭.tsx | subject-prediction-tab.tsx | Subject prediction tab |
| K_상세보기_성적반영방법탭.tsx | grade-reflection-method-tab.tsx | Grade reflection method tab |
| K_상세보기_비교과예측탭.tsx | non-subject-prediction-tab.tsx | Non-subject prediction tab |
| K_상세보기_타대학_동일계열.tsx | other-universities-same-field.tsx | Other universities same field |
| K_상세보기_학종모달_내용.tsx | comprehensive-modal-content.tsx | Comprehensive modal content |
| K_상세보기_합격예측탭.tsx | admission-prediction-tab.tsx | Admission prediction tab |
| K_상세보기_동일대학타학과_차트.tsx | same-university-other-departments-chart.tsx | Same university other departments chart |
| K_상세보기_교과모달_내용.tsx | subject-modal-content.tsx | Subject modal content |

### Legacy Component Files
| Current | New | Description |
|---------|-----|-------------|
| K_정시.tsx | regular-admission.tsx | Regular admission component |
| K_교과.tsx | subject-based.tsx | Subject-based admission |
| K_학종.tsx | comprehensive-evaluation.tsx | Comprehensive evaluation |
| K_정시_상세보기.tsx | regular-admission-detail.tsx | Regular admission detail |

## Migration Strategy
1. Create new files with English names
2. Update all import statements
3. Test functionality
4. Remove old Korean-named files
5. Update any documentation references

## Impact Assessment
- **Files to rename**: 40+ files
- **Import statements to update**: 100+ references
- **Risk level**: Medium (requires careful testing)
- **Estimated time**: 2-3 hours

## Rollback Plan
- Git commit before changes
- Keep backup of import mapping
- Automated rollback script if needed