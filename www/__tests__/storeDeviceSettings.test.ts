import { readConsentState, markConsented } from '../js/splash/startprefs';
import { storageClear } from '../js/plugin/storage';
import { getUser } from '../js/commHelper';
import { initStoreDeviceSettings, teardownDeviceSettings } from '../js/splash/storeDeviceSettings';
import {
  mockBEMDataCollection,
  mockBEMServerCom,
  mockBEMUserCache,
  mockCordova,
  mockDevice,
  mockGetAppVersion,
} from '../__mocks__/cordovaMocks';
import { mockLogger } from '../__mocks__/globalMocks';
import { EVENT_NAMES, publish } from '../js/customEventHandler';

mockBEMUserCache();
mockDevice();
mockCordova();
mockLogger();
mockGetAppVersion();
mockBEMServerCom();
mockBEMDataCollection();

global.fetch = (url: string) =>
  new Promise((rs, rj) => {
    setTimeout(() =>
      rs({
        json: () =>
          new Promise((rs, rj) => {
            let myJSON = {
              emSensorDataCollectionProtocol: {
                protocol_id: '2014-04-6267',
                approval_date: '2016-07-14',
              },
            };
            setTimeout(() => rs(myJSON), 100);
          }),
      }),
    );
  }) as any;

beforeEach(async () => {
  teardownDeviceSettings();
  await storageClear({ local: true, native: true });
  let user = await getUser();
  expect(user).toBeUndefined();
});

it('stores device settings when intialized after consent', async () => {
  await readConsentState();
  let marked = await markConsented();
  await new Promise((r) => setTimeout(r, 500));
  initStoreDeviceSettings();
  await new Promise((r) => setTimeout(r, 500));
  let user = await getUser();
  expect(user).toMatchObject({
    client_os_version: '14.0.0',
    client_app_version: '1.2.3',
  });
});

it('verifies my subscrition clearing', async () => {
  initStoreDeviceSettings();
  await new Promise((r) => setTimeout(r, 500));
  teardownDeviceSettings();
  publish(EVENT_NAMES.INTRO_DONE_EVENT, 'test data');
  let user = await getUser();
  expect(user).toBeUndefined();
});

it('does not store if not subscribed', async () => {
  publish(EVENT_NAMES.INTRO_DONE_EVENT, 'test data');
  publish(EVENT_NAMES.CONSENTED_EVENT, 'test data');
  await new Promise((r) => setTimeout(r, 500)); //time to carry out event handling
  let user = await getUser();
  expect(user).toBeUndefined();
});

it('stores device settings after intro done', async () => {
  initStoreDeviceSettings();
  await new Promise((r) => setTimeout(r, 500)); //time to check consent and subscribe
  publish(EVENT_NAMES.INTRO_DONE_EVENT, 'test data');
  await new Promise((r) => setTimeout(r, 500)); //time to carry out event handling
  let user = await getUser();
  expect(user).toMatchObject({
    client_os_version: '14.0.0',
    client_app_version: '1.2.3',
  });
});
