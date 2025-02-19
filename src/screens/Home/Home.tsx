import React, {useEffect, useState} from 'react';
import {
  Box,
  Button,
  Event,
  Footer,
  Link,
  Placeholder,
  Section,
  TicketPreview,
} from '@app/components';
import {ScrollView} from 'react-native';
import {useEventSchedule} from '@app/hooks';
import {getPatronTickets} from '@app/api';
import {TDC} from '@app/api/model/tdc';
import {useDispatch} from 'react-redux';
import {partition} from '@app/helpers';
import {setActive, setInactive} from '@app/context/features';
import {useNavigation} from '@react-navigation/native';
import {
  RootStackNavigationProps,
  TicketStackNavigationProps,
} from '@app/navigation/types';

export default function Home(): JSX.Element {
  const [activeItem, setActiveItem] = useState<Array<TDC.LineItem>>([]);
  const [loading, setLoading] = useState(true);

  const events = useEventSchedule();
  const dispatch = useDispatch();

  const ticketNav = useNavigation<RootStackNavigationProps<'Main'>>();
  const purchaseNav = useNavigation<TicketStackNavigationProps<'Wallet'>>();

  const navigateToTicket = () => ticketNav.navigate('ViewTicket');
  const navigateToPurchaseTicket = () => purchaseNav.navigate('PurchaseTicket');

  useEffect(() => {
    async function fetchPatronInfo() {
      try {
        const userId = 613373703;
        const response = await getPatronTickets(userId);

        const [active, inactive] = partition(
          response,
          (lineItem: TDC.LineItem) =>
            lineItem.tickets.length > 0 ? lineItem.tickets[0]!.active : false,
        );

        dispatch(setActive(active));
        dispatch(setInactive(inactive));

        setActiveItem(active);
      } catch (err) {
        console.log('Handle this better!!!!');
      } finally {
        setLoading(false);
      }
    }
    fetchPatronInfo();
  }, []);

  return (
    <>
      {loading ? null : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <Section title="Your Upcoming Tickets">
            {activeItem.length > 0 ? (
              activeItem.map(item => (
                <TicketPreview
                  active={true}
                  key={item.id}
                  lineItem={item}
                  onPress={navigateToTicket}
                />
              ))
            ) : (
              <Button
                onPress={navigateToPurchaseTicket}
                title="Purchase tickets"
                variant="default"
              />
            )}
          </Section>
          <Section title="Events at Polar Park" mb="l">
            {events.map((event, idx) => {
              if (idx > 3) return;
              return (
                <React.Fragment key={event.id}>
                  {idx > 0 ? (
                    <Box
                      borderColor="horizontalRule"
                      borderBottomWidth={0.4}
                      my="s"
                    />
                  ) : null}
                  <Event event={event} />
                </React.Fragment>
              );
            })}
            <Link
              mt="l"
              onPress={() => {}}
              color="authenticationLink"
              fontWeight="bold"
              textAlign="center"
              variant="body">
              View more
            </Link>
          </Section>
          <Section title="Polar Park News">
            <Placeholder height={112} mb="m" width="100%" />
            <Placeholder height={112} mb="m" width="100%" />
            <Placeholder height={112} mb="m" width="100%" />
          </Section>
          <Footer text="Having troubles with the Polar Park app?" />
        </ScrollView>
      )}
    </>
  );
}
