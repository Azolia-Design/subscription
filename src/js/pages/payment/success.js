import { selector } from '../../helper/index';
import { getPaymentResult, getPaymentDetail } from '../../api/success'
import planListing from '../../../../plan-data.json'
const payment_success = {
    namespace: "payment_success",
    afterEnter(data) {
        console.log(`enter ${this.namespace}`);

        let successWrapClone = $('.success-wrap').clone();
        // gsap.set(successWrapClone, { autoAlpha: 0, y: 10 });
        $('.success-wrap').remove();

        let params = new URL(document.location).searchParams;
        let session_id = params.get("session_id");
        let payment_id = params.get('payment_id');

        let successSelector = selector(successWrapClone);

        const successFormResult = async () => {
            let data_payment_result = await getPaymentResult(session_id);

            let totalPrice = (data_payment_result.amount_total / 100).toLocaleString();
            successSelector('[data-payment-price]').text(totalPrice);

            let options = { day: 'numeric', month: 'short', year: 'numeric' };
            let expiresAt = new Date(data_payment_result.expires_at * 1000).toLocaleDateString('en-GB', options).replace(/(\d{2}) (\w{3})/, '$1 $2,');

            successSelector('[data-payment-expires]').text(expiresAt);
            successSelector('[data-payment-plan]').text(planListing[payment_id].name.split(" ").at(0));
            successSelector('[data-payment-periodic]').text(`/${planListing[payment_id].name.split(" ").at(-1).toLowerCase()}`);
            successSelector('[data-payment-scope]').text(planListing[payment_id].scope);
        }

        const showSuccessForm = () => {
            let tl = gsap.timeline();
            $('.main.success').append(successWrapClone);

            tl
            .from('.success-bg', {
                autoAlpha: 0.5, duration: 2
            })
            .from(successSelector('.success-popup'), {
                autoAlpha: 0, y: 15, ease: 'power1.out', duration: 1
            }, 0).from(successSelector('.success-thanks'), {
                autoAlpha: 0, y: 15, ease: 'power1.out', duration: .8
            }, ">=-0.6")
            .from(successSelector('.success-back'), {
                autoAlpha: 0, y: 15, ease: 'power1.out', duration: .8
            }, ">=-0.6")
            .from(successSelector('.success-contact'), {
                autoAlpha: 0, ease: 'power1.out', duration: 1
            }, ">=-0.5")
        }
        async function successMain() {
            await successFormResult();
            await showSuccessForm();
        }
        successMain();
    },
    beforeLeave(data) {
        console.log(`leave ${this.namespace}`);
    }
}

export default payment_success;
