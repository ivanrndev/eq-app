import {useSelector} from 'react-redux';

export const useUserPlan = () => {
  const currentCompany = useSelector(({auth}) => auth.currentCompany);
  const plan =
    currentCompany && currentCompany.plan ? currentCompany.plan.title : '';
  const isNotFreePlan =
    plan === 'optimal' ||
    plan === 'optimal +' ||
    plan === 'premium' ||
    plan === 'start';
  return {isNotFreePlan, plan};
};
