/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import {FlashList} from '@shopify/flash-list';
import {Box, ContentWrapper, ScheduleItem, Text} from '@app/components';
import {TicketFlowScreenProps} from '@app/navigation/types';
import {TDC} from '@app/api/model/tdc';
import {useEventSchedule} from '@app/hooks';
import UpcomingTickets from '@app/components/ui/UpcomingTickets/UpcomingTickets'; // Make sure the path is correct

interface ScheduleItemWrapperProps {
  event: TDC.Event;
}

function ScheduleItemWrapper({event}: ScheduleItemWrapperProps): JSX.Element {
  const {publicDescription, shortPublicDescription, date} = event;

  return (
    <Box my="l">
      <ScheduleItem
        description={publicDescription}
        isoString={date}
        title={shortPublicDescription}
      />
    </Box>
  );
}

export default function PurchaseTicketScreen(
  props: TicketFlowScreenProps<'PurchaseTicket'>,
): JSX.Element {
  const events = useEventSchedule();

  return (
    <ContentWrapper>
      <Box height="100%">
        {/* Header for the upcoming tickets */}
        <Text variant="heading2" mb="m">
          Upcoming Tickets
        </Text>

        {/* Render UpcomingTickets at the top */}
        <UpcomingTickets />

        {/* FlashList for purchasing tickets */}
        <FlashList
          data={events}
          estimatedItemSize={100}
          ItemSeparatorComponent={() => (
            <Box borderColor="horizontalRule" borderBottomWidth={0.4} />
          )}
          renderItem={({item}) => <ScheduleItemWrapper event={item} />}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={() => (
            <Text variant="heading2">Purchase tickets</Text>
          )}
        />
      </Box>
    </ContentWrapper>
  );
}
