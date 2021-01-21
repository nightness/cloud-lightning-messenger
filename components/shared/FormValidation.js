// Modified version of yup-phone, so it doesn't invalidate empty phone numbers, that's .required()'s job

import * as Yup from 'yup';
import gPhoneNumber from 'google-libphonenumber';

const phoneUtil = gPhoneNumber.PhoneNumberUtil.getInstance();

const YUP_PHONE_METHOD = 'phone';
const CLDR_REGION_CODE_SIZE = 2;

const isValidCountryCode = (countryCode) =>
    typeof countryCode === 'string' &&
    countryCode.length === CLDR_REGION_CODE_SIZE;

Yup.addMethod(Yup.string, YUP_PHONE_METHOD, function yupPhone(
    countryCode,
    strict = false,
    errorMessage = ''
) {
    const errMsg =
        typeof errorMessage === 'string' && errorMessage
            ? errorMessage
            : isValidCountryCode(countryCode)
                ? `\${path} must be a valid phone number for region ${countryCode}`
                : '${path} must be a valid phone number.';
    // @ts-ignore
    return this.test(YUP_PHONE_METHOD, errMsg, (value) => {

        if (!isValidCountryCode(countryCode)) {
            // if not valid countryCode, then set default country to India (IN)
            countryCode = 'US';
            strict = false;
        }
        // This is what .required() is for
        if (!value || ((typeof(value) === 'string') && value.length === 0)) return true

        try {
            const phoneNumber = phoneUtil.parseAndKeepRawInput(value, countryCode);
            
            if (phoneNumber && phoneNumber.length > 0 && !phoneUtil.isPossibleNumber(phoneNumber)) {
                return false;
            }

            const regionCodeFromPhoneNumber = phoneUtil.getRegionCodeForNumber(
                phoneNumber
            );

            /* check if the countryCode provided should be used as
             default country code or strictly followed
           */
            return strict
                ? phoneUtil.isValidNumberForRegion(phoneNumber, countryCode)
                : phoneUtil.isValidNumberForRegion(
                    phoneNumber,
                    regionCodeFromPhoneNumber
                );
        } catch {
            return false;
        }
    });
});